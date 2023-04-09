import {
  RendererInterface,
  RendererConfigInterface,
  RendererEngineInterface,
} from './interfaces';

export * from './interfaces';

/**
 * A renderer class.
 *
 * @remarks
 * This class implements basic canvas `2D` rendering.
 */
export class Renderer implements RendererInterface {
  /**
   * The canvas of the renderer.
   */
  protected canvas: HTMLCanvasElement;

  /**
   * The context of the renderer's cavnas.
   */
  protected context: CanvasRenderingContext2D;

  /**
   * The resize observer of the renderer for resize handling.
   */
  protected resizeObserver: ResizeObserver;

  /**
   * The width of the renderer's canvas.
   */
  public width: number;

  /**
   * The height of the renderer's canvas.
   */
  public height: number;

  /**
   * Creates an instance of the Renderer class.
   *
   * @param node The DOM node to which the renderer will be attached.
   * @param config An optional object that contains additional configuration options.
   */
  constructor(
    protected readonly node: HTMLElement | Element,
    protected readonly config: RendererConfigInterface = {},
  ) {
    this.initializeRenderer();
    this.attachAttributes();

    this.resizeObserver.observe(this.node);
  }

  /**
   * Initializes the renderer by creating a new canvas element,
   * getting the 2D context of the canvas, and attaching a ResizeObserver to it.
   * The canvas element is then prepended to the DOM node specified by the `this.node` property of the class instance.
   */
  protected initializeRenderer(): void {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.resizeObserver = new ResizeObserver(this.resizeCallback.bind(this));

    this.node.prepend(this.canvas);
  }

  /**
   * Attaches attributes to the canvas element based on the `attributes` property of the `config` parameter.
   */
  protected attachAttributes(): void {
    if (!this.config.attributes) {
      return;
    }

    Object.entries(this.config.attributes).forEach(([key, value]) => {
      this.canvas.setAttribute(key, `${ value }`);
    });
  }

  /**
   * Updates the size of the canvas element and the renderer.
   * The `width` and `height` parameters specify the new size of the canvas element and the renderer.
   *
   * @param width The new width of the canvas element and the renderer.
   * @param height The new height of the canvas element and the renderer.
   */
  protected updateRendereSize(width: number, height: number): void {
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
  }

  /**
   * A callback function that is invoked when the size of the observed `node` changes.
   * The method updates the size of the canvas element and the renderer based on the new size of the `node`.
   *
   * @param node An array of ResizeObserverEntry objects representing the observed nodes.
   */
  protected resizeCallback([node]: ResizeObserverEntry[]): void {
    const { contentRect } = node;
    const { width, height, adaptive } = this.config;

    if (!adaptive) {
      this.updateRendereSize(width ?? contentRect.width, height ?? contentRect.height);

      this.resizeObserver.disconnect();
    }

    const NEW_WIDTH = width
      ? Math.min(width, contentRect.width)
      : contentRect.width;

    const NEW_HEIGHT = height
      ? Math.min(height, contentRect.height)
      : contentRect.height;

    this.updateRendereSize(NEW_WIDTH, NEW_HEIGHT);
  }

  /**
   * Updates the renderer's scene by clearing the canvas or filling it with a background color,
   * if specified in the `config`.
   */
  protected updateRendererScene(): void {
    if (this.config.backgroundColor) {
      this.context.fillStyle = this.config.backgroundColor;
      this.context.fillRect(0, 0, this.width, this.height);

      return;
    }

    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Adds an event listener to the specified element using the given event name and callback function.
   *
   * @param name The name of the event to listen for.
   * @param callback The function to call when the event is triggered.
   * @param element The element to attach the event listener to.
   */
  public handleEvent(
    name: keyof HTMLElementEventMap,
    callback: (engine: RendererEngineInterface, event: PointerEvent & Event) => any,
    element: any = this.canvas,
  ): void {
    element.addEventListener(name, callback.bind(this, { context: this.context, canvas: this.canvas }));
  }

  /**
   * Renders the scene on the canvas element using the given callback function.
   *
   * @param callback The function to call when rendering the scene.
   */
  public render(callback: (engine: RendererEngineInterface) => any): void {
    this.updateRendererScene();

    callback({ context: this.context, canvas: this.canvas });

    setTimeout(
      () => requestAnimationFrame(this.render.bind(this, callback)),
      1000 / this.config.framesPerSecond ?? 60,
    );
  }
}
