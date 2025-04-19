import { expect, Locator, Page, test } from '@playwright/test'
import { BasePage, step } from './base-page'

export class ShopPage extends BasePage {
  readonly shopButton: Locator
  readonly addProductToCarButton: Locator
  readonly quantityInput: Locator
  readonly checkoutButton: Locator
  readonly productNameHeader: Locator
  readonly cartList: Locator
  readonly cartHeaderButton: Locator
  readonly removeItemButton: Locator
  readonly confirmRemoveItemButton: Locator
  readonly emptyCartMessageContainer: Locator

  constructor(page: Page) {
    super(page)
    this.shopButton = page.getByTestId('headerItem-0')
    this.addProductToCarButton = page.getByTestId('pdpAddToProduct')
    this.quantityInput = page.getByTestId('cartQuantity')
    this.checkoutButton = page.getByTestId('miniCartCheckoutButton')
    this.productNameHeader = page.locator('.product-heading > h1')
    this.cartList = page.getByTestId('regular-cart-list')
    this.cartHeaderButton = page.getByTestId('cartIcon').first()
    this.removeItemButton = page.getByTestId('regular-cart-list').getByTestId('cartRemoveButton')
    this.confirmRemoveItemButton = page.getByTestId('remove-item-submit-button')
    this.emptyCartMessageContainer = page
      .getByTestId('page-base-layout-content')
      .getByTestId('emptyCartContainer')
  }

  async addingProductToCart(url: string, shopButtonLocator: string, productSKU: string) {
    await this.navigateToUrl(url)

    await this.clickOnElement(shopButtonLocator)

    await this.openProductBySKU(productSKU)

    const productName = await this.getProductName()

    await this.addProductToCart()

    await expect(this.quantityInput, 'Cart should contain 1 product').toHaveValue('1')

    await test.step('Click on the checkout button', async () => {
      await this.checkoutButton.click()
    })

    await expect(
      this.cartList.filter({ hasText: productName }),
      'Product is visible in the basket'
    ).toBeVisible()
  }

  @step('Click on the element')
  async clickOnElement(element: string) {
    await this.page.dispatchEvent(element, 'click')
  }

  @step('Get product name')
  async getProductName() {
    const productName = await this.productNameHeader.innerText()
    if (productName === null) {
      throw new Error('Product name is null')
    } else {
      return productName
    }
  }

  @step('Select the product')
  async openProductBySKU(sku: string) {
    await this.page
      .locator(`div[data-sku="${sku}"] a[data-track-click='cta_click']`)
      .dispatchEvent('click')
    await this.page.waitForLoadState('load')
  }

  @step('Add product to cart')
  async addProductToCart() {
    await this.addProductToCarButton.click()
  }
}
