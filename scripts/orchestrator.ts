/**
 * Main Orchestrator
 * Runs all scrapers and processors in sequence
 * Entry point for the complete MERZY scraping pipeline
 */

import * as path from 'path';
import { Logger, FileSystem, Timer, Wait } from './scrapers/utils';
import InstagramScraper from './scrapers/instagram.scraper';
import FacebookScraper from './scrapers/facebook.scraper';
import TalabatScraper from './scrapers/talabat.scraper';
import DataProcessor from './data-processor/processor';
import { ScraperOptions } from './scrapers/types';

export class Orchestrator {
  private outputDir: string;
  private options: ScraperOptions;

  constructor(outputDir: string = './scraped-data', options?: ScraperOptions) {
    this.outputDir = outputDir;
    this.options = options || {};

    // Ensure output directories exist
    FileSystem.ensureDirs([
      outputDir,
      `${outputDir}/raw`,
      `${outputDir}/processed`,
      `${outputDir}/images`
    ]);
  }

  /**
   * Run complete pipeline: all scrapers + processor
   */
  async runFullPipeline(): Promise<void> {
    const timer = new Timer();
    Logger.section('MERZY Complete Data Pipeline');
    Logger.log(`Output directory: ${this.outputDir}\n`);

    try {
      // Run scrapers
      await this.runAllScrapers();

      // Process data
      await this.processAllData();

      // Print final report
      this.printFinalReport(timer.elapsedSeconds());
    } catch (error: any) {
      Logger.error('\nPipeline failed:', error.message);
      if (this.options.verbose) {
        Logger.debug(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Run only scrapers (skip processing)
   */
  async runAllScrapers(): Promise<void> {
    Logger.section('Step 1: Running All Scrapers');

    const scrapers = [
      { name: 'Instagram', fn: () => this.runInstagramScraper() },
      { name: 'Facebook', fn: () => this.runFacebookScraper() },
      { name: 'Talabat', fn: () => this.runTalabatScraper() }
    ];

    for (const scraper of scrapers) {
      Logger.log(`\n${scraper.name} Scraper...`);
      try {
        await scraper.fn();
        Logger.success(`✓ ${scraper.name} completed\n`);
        await Wait.delay(2000); // Delay between scrapers
      } catch (error: any) {
        Logger.error(`✗ ${scraper.name} failed:`, error.message);
        // Continue with next scraper
      }
    }
  }

  /**
   * Run only data processor
   */
  async processAllData(): Promise<void> {
    Logger.section('Step 2: Processing Data');

    const processor = new DataProcessor(this.outputDir);
    await processor.processAll();
  }

  /**
   * Run Instagram scraper
   */
  private async runInstagramScraper(): Promise<void> {
    const scraper = new InstagramScraper('@merzy.eg', this.options);
    const result = await scraper.scrapeAll();

    if (!result.success) {
      Logger.warn(`  Warnings: ${result.errors.join(', ')}`);
    }

    FileSystem.writeJson(`${this.outputDir}/raw/instagram-posts.json`, result);
    Logger.log(`  Saved to ${this.outputDir}/raw/instagram-posts.json`);
    Logger.log(`  Posts: ${result.posts.length}, Highlights: ${result.highlights.length}`);
  }

  /**
   * Run Facebook scraper
   */
  private async runFacebookScraper(): Promise<void> {
    const pageId = process.env.FACEBOOK_PAGE_ID || '61583371166412';
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!accessToken) {
      Logger.warn('  No FACEBOOK_PAGE_ACCESS_TOKEN - using mock data');
    }

    const scraper = new FacebookScraper(pageId, accessToken, this.options);
    const result = await scraper.scrapeAll();

    if (!result.success) {
      Logger.warn(`  Warnings: ${result.errors.join(', ')}`);
    }

    FileSystem.writeJson(`${this.outputDir}/raw/facebook-posts.json`, result);
    Logger.log(`  Saved to ${this.outputDir}/raw/facebook-posts.json`);
    Logger.log(`  Posts: ${result.posts.length}, Reviews: ${result.reviews.length}`);
  }

  /**
   * Run Talabat scraper
   */
  private async runTalabatScraper(): Promise<void> {
    const restaurantId = process.env.TALABAT_RESTAURANT_ID || '1102357';

    const scraper = new TalabatScraper(restaurantId, this.options);
    const result = await scraper.scrapeAll();

    if (!result.success) {
      Logger.warn(`  Warnings: ${result.errors.join(', ')}`);
    }

    FileSystem.writeJson(`${this.outputDir}/raw/talabat-menu.json`, result);
    Logger.log(`  Saved to ${this.outputDir}/raw/talabat-menu.json`);
    Logger.log(`  Menu items: ${result.menu.length}, Reviews: ${result.reviews.length}`);
  }

  /**
   * Print final summary report
   */
  private printFinalReport(durationSeconds: number): void {
    Logger.section('Pipeline Complete ✅');
    Logger.log(`\nTotal Duration: ${durationSeconds}s\n`);
    Logger.log('Generated Files:');
    Logger.log('  • src/app/core/data/merzy-social.ts');
    Logger.log('  • src/app/core/data/menu.ts');
    Logger.log('\nNext Steps:');
    Logger.log('  1. Verify the generated files look correct');
    Logger.log('  2. Check images were downloaded to scraped-data/images/');
    Logger.log('  3. Commit changes to git');
    Logger.log('  4. Angular dev server will hot-reload with new data');
  }
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  const options: ScraperOptions = {
    verbose: process.env.DEBUG_SCRAPER === 'true' || args.includes('--verbose'),
    testMode: args.includes('--test'),
    validateOnly: args.includes('--validate-only')
  };

  const outputDir = process.env.OUTPUT_DIR || './scraped-data';

  Logger.setVerbose(options.verbose);

  const orchestrator = new Orchestrator(outputDir, options);

  // Determine what to run
  if (args.includes('--scrapers-only')) {
    Logger.log('Running scrapers only (no processing)...\n');
    await orchestrator.runAllScrapers();
  } else if (args.includes('--process-only')) {
    Logger.log('Processing data only (no scraping)...\n');
    await orchestrator.processAllData();
  } else {
    Logger.log('Running full pipeline (scrapers + processor)...\n');
    await orchestrator.runFullPipeline();
  }
}

if (require.main === module) {
  main().catch(error => {
    Logger.error('Fatal error:', error);
    process.exit(1);
  });
}

export default Orchestrator;
