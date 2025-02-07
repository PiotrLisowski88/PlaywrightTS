import { expect, Locator, Page, test } from '@playwright/test'

export class BasePage {
  readonly page: Page
  readonly acceptCookiesButton: Locator
  readonly cookieBanner: Locator
  readonly ageConfirmationWrapper: Locator
  readonly confirmAgeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler')
    this.cookieBanner = page.locator('#onetrust-group-container')
    this.ageConfirmationWrapper = page.locator('.ageconfirmation__wrapper')
    this.confirmAgeButton = page.locator('.ageconfirmation__actionWrapper > div > span')
  }

  @step('Navigate to the URL')
  async navigateToUrl(url: string) {
    await this.page.goto(url)
    if (await this.cookieBanner.isVisible()) {
      await this.acceptCookiesButton.click()
    }
    if (await this.ageConfirmationWrapper.isVisible()) {
      await this.confirmAgeButton.click()
    }
  }

  @step('Verify no broken images on product page')
  async verifyImagesReturnValidStatus() {
    const images = await this.page.$$('img')

    for (const img of images) {
      const src = await img.getAttribute('src')
      if (!src || !src.startsWith('http')) {
        continue
      }

      const response = await this.page.request.get(src)
      expect
        .soft(response.status(), `Image ${src} returned status ${response.status()}`)
        .toBeLessThan(400)
    }
  }

  @step('Verify no broken links on product page ')
  async validateLinksOnPage() {
    const allLinkHrefs = (await this.page.$$eval('a[href]', elements =>
      elements.map(el => el.getAttribute('href')).filter(Boolean)
    )) as string[]

    // Transform the array of link targets into a Set to remove duplicates
    const linkSet = new Set<string>()

    for (const href of allLinkHrefs) {
      // Filter out non-HTTP links or in-page anchors or mailto links
      if (!href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
        continue
      }

      linkSet.add(href)
    }

    // iterate through only unique links
    for (const link of linkSet) {
      console.log('Checking:', link) // TODO: May wanna remove this line in production
      const response = await fetch(link)

      expect.soft(response.status, `Link ${link} should be valid`).toBeLessThan(400)
    }
  }
}

// Just to show how the decorator works (instead of using await test.step)
export function step(stepName?: string) {
  return function decorator(target: Function, context: ClassMethodDecoratorContext) {
    return function replacementMethod(this: any, ...args: any) {
      const name = stepName || `${this.constructor.name + '.' + (context.name as string)}`
      return test.step(name, async () => {
        return await target.call(this, ...args)
      })
    }
  }
}
