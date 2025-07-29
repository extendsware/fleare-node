import fleare, { Options } from "../libs";

interface TestResult {
  requestId: number;
  success: boolean;
  duration: number;
  error?: string;
  timestamp: number;
}

interface TestStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  totalDuration: number;
  concurrencyLevel: number;
  poolSize: number;
}

class HighConcurrencyTest {
  private client: any;
  private results: TestResult[] = [];
  private startTime: number = 0;
  private endTime: number = 0;

  constructor(
    private host: string,
    private port: number,
    private options: Options,
  ) {}

  async initialize(): Promise<void> {
    console.log("🔄 Initializing client with options:", this.options);

    this.client = fleare.createClient(this.host, this.port, this.options);

    // Set up event listeners for monitoring
    this.client.on("error", (err: Error) => {
      console.error("❌ Client error:", err.message);
    });

    this.client.on("close", () => {
      console.log("🔌 Client connection closed");
    });

    console.log("🔄 Connecting to server...");
    await this.client.connect();
    console.log("✅ Client connected successfully!");
  }

  async runConcurrencyTest(
    totalRequests: number,
    concurrencyLevel: number,
  ): Promise<TestStats> {
    console.log(`\n🚀 Starting high concurrency test:`);
    console.log(`   • Total requests: ${totalRequests}`);
    console.log(`   • Concurrency level: ${concurrencyLevel}`);
    console.log(`   • Pool size: ${this.options.poolSize}`);
    console.log(`   • Max queue size: ${this.options.maxQueueSize}`);

    this.results = [];
    this.startTime = Date.now();

    // Create batches of concurrent requests
    const batches: Promise<void>[][] = [];
    for (let i = 0; i < totalRequests; i += concurrencyLevel) {
      const batchSize = Math.min(concurrencyLevel, totalRequests - i);
      const batch: Promise<void>[] = [];

      for (let j = 0; j < batchSize; j++) {
        const requestId = i + j;
        batch.push(this.executeRequest(requestId));
      }

      batches.push(batch);
    }

    // Execute batches with small delays to simulate real-world scenarios
    let completedRequests = 0;
    for (const batch of batches) {
      await Promise.all(batch);
      completedRequests += batch.length;

      // Print progress every 100 requests
      if (
        completedRequests % 100 === 0 ||
        completedRequests === totalRequests
      ) {
        const poolStats = this.client.connectionPool?.getPoolStats?.() || {};
        console.log(
          `📊 Progress: ${completedRequests}/${totalRequests} | Queue: ${poolStats.queuedRequests || 0} | Busy: ${poolStats.busyConnections || 0}/${poolStats.totalConnections || 0}`,
        );
      }

      // Small delay between batches to prevent overwhelming
      if (
        batch.length === concurrencyLevel &&
        completedRequests < totalRequests
      ) {
        await this.sleep(10);
      }
    }

    this.endTime = Date.now();
    return this.calculateStats(concurrencyLevel);
  }

  private async executeRequest(requestId: number): Promise<void> {
    const requestStart = Date.now();

    try {
      // Mix different types of operations
      const operations = ["get"];
      const operation = operations[requestId % operations.length];

      let result: any;
      switch (operation) {
        case "get":
          result = await this.client.get(`test:key:${requestId % 100}`);
          break;
        case "set":
          result = await this.client.set(
            `test:key:${requestId % 100}`,
            `value_${requestId}`,
          );
          break;
        case "exists":
          result = await this.client.exists(`test:key:${requestId % 100}`);
          break;
        case "keys":
          result = await this.client.keys("test:key:*");
          break;
        default:
          result = await this.client.get(`test:key:${requestId % 100}`);
      }

      const duration = Date.now() - requestStart;
      this.results.push({
        requestId,
        success: true,
        duration,
        timestamp: requestStart,
      });
    } catch (error) {
      const duration = Date.now() - requestStart;
      this.results.push({
        requestId,
        success: false,
        duration,
        error: error instanceof Error ? error.message : String(error),
        timestamp: requestStart,
      });
    }
  }

  private calculateStats(concurrencyLevel: number): TestStats {
    const totalDuration = this.endTime - this.startTime;
    const successfulResults = this.results.filter((r) => r.success);
    const failedResults = this.results.filter((r) => !r.success);

    const durations = this.results.map((r) => r.duration);
    const averageResponseTime =
      durations.reduce((a, b) => a + b, 0) / durations.length;
    const minResponseTime = Math.min(...durations);
    const maxResponseTime = Math.max(...durations);
    const requestsPerSecond = (this.results.length / totalDuration) * 1000;

    return {
      totalRequests: this.results.length,
      successfulRequests: successfulResults.length,
      failedRequests: failedResults.length,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      minResponseTime,
      maxResponseTime,
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
      totalDuration,
      concurrencyLevel,
      poolSize: this.options.poolSize || 10,
    };
  }

  private printDetailedStats(stats: TestStats): void {
    console.log("\n📈 DETAILED TEST RESULTS");
    console.log("=".repeat(50));
    console.log(`Total Requests:        ${stats.totalRequests}`);
    console.log(
      `Successful:           ${stats.successfulRequests} (${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)}%)`,
    );
    console.log(
      `Failed:               ${stats.failedRequests} (${((stats.failedRequests / stats.totalRequests) * 100).toFixed(2)}%)`,
    );
    console.log(`Total Duration:       ${stats.totalDuration}ms`);
    console.log(`Requests/Second:      ${stats.requestsPerSecond}`);
    console.log(`Concurrency Level:    ${stats.concurrencyLevel}`);
    console.log(`Pool Size:           ${stats.poolSize}`);
    console.log("\n⏱️  RESPONSE TIME STATISTICS");
    console.log("-".repeat(30));
    console.log(`Average:             ${stats.averageResponseTime}ms`);
    console.log(`Minimum:             ${stats.minResponseTime}ms`);
    console.log(`Maximum:             ${stats.maxResponseTime}ms`);

    // Show error breakdown if there were failures
    if (stats.failedRequests > 0) {
      console.log("\n❌ ERROR BREAKDOWN");
      console.log("-".repeat(20));
      const errorCounts: { [key: string]: number } = {};
      this.results
        .filter((r) => !r.success)
        .forEach((r) => {
          const errorType = r.error || "Unknown error";
          errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
        });

      Object.entries(errorCounts).forEach(([error, count]) => {
        console.log(`${error}: ${count} occurrences`);
      });
    }

    // Show response time distribution
    console.log("\n⚡ RESPONSE TIME DISTRIBUTION");
    console.log("-".repeat(32));
    const buckets = [0, 10, 25, 50, 100, 250, 500, 1000, Infinity];
    const bucketCounts = new Array(buckets.length - 1).fill(0);

    this.results.forEach((result) => {
      for (let i = 0; i < buckets.length - 1; i++) {
        if (result.duration >= buckets[i] && result.duration < buckets[i + 1]) {
          bucketCounts[i]++;
          break;
        }
      }
    });

    buckets.slice(0, -1).forEach((bucket, index) => {
      const nextBucket = buckets[index + 1];
      const range =
        nextBucket === Infinity ? `${bucket}ms+` : `${bucket}-${nextBucket}ms`;
      const count = bucketCounts[index];
      const percentage = ((count / stats.totalRequests) * 100).toFixed(1);
      console.log(
        `${range.padEnd(12)}: ${count.toString().padStart(4)} (${percentage}%)`,
      );
    });
  }

  async runLoadTest(): Promise<void> {
    const testCases = [
      { requests: 10000, concurrency: 1000 },
      { requests: 100000, concurrency: 10000 },
    ];

    console.log("🔥 Starting comprehensive load test...\n");

    for (const testCase of testCases) {
      try {
        console.log(`\n${"=".repeat(60)}`);
        console.log(
          `🧪 Test Case: ${testCase.requests} requests, ${testCase.concurrency} concurrent`,
        );
        console.log(`${"=".repeat(60)}`);

        const stats = await this.runConcurrencyTest(
          testCase.requests,
          testCase.concurrency,
        );
        this.printDetailedStats(stats);

        // Get final pool statistics
        if (this.client.connectionPool?.getPoolStats) {
          const poolStats = this.client.connectionPool.getPoolStats();
          console.log("\n🔧 FINAL POOL STATISTICS");
          console.log("-".repeat(25));
          console.log(`Total Connections:    ${poolStats.totalConnections}`);
          console.log(`Available:           ${poolStats.availableConnections}`);
          console.log(`Total Requests:      ${poolStats.totalRequests}`);
          console.log(
            `Avg Req/Connection:  ${poolStats.averageRequestsPerConnection.toFixed(2)}`,
          );
        }

        // Wait between test cases
        if (testCase !== testCases[testCases.length - 1]) {
          console.log("\n⏳ Waiting 2 seconds before next test...");
          // await this.sleep(2000);
        }
      } catch (error) {
        console.error(`❌ Test case failed:`, error);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async cleanup(): Promise<void> {
    console.log("\n🧹 Cleaning up...");
    if (this.client) {
      await this.client.close();
      console.log("✅ Client closed successfully");
    }
  }
}

async function main(): Promise<void> {
  const options: Options = {
    poolSize: 100, // Only 10 connections
    maxQueueSize: 100000, // Allow up to 2000 queued requests
    requestTimeout: 30000, // 30 second timeout per request
    connectTimeout: 30, // 30 second connection timeout
    maxRetries: 3, // Retry failed connections 3 times
    retryInterval: 10, // Wait 10 seconds between retries
    // username: "your_username",    // Uncomment if auth is required
    // password: "your_password",    // Uncomment if auth is required
  };

  const test = new HighConcurrencyTest("127.0.0.1", 9219, options);

  try {
    await test.initialize();
    await test.runLoadTest();
  } catch (error) {
    console.error("💥 Test failed:", error);
    process.exit(1);
  } finally {
    await test.cleanup();
  }

  console.log("\n🎉 All tests completed successfully!");
  process.exit(0);
}

// Run the test if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { HighConcurrencyTest, TestResult, TestStats };
