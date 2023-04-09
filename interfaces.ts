/**
 * An interface representing the configuration options for a Renderer instance.
 *
 * @export
 * @interface RendererConfigInterface
 */
export interface RendererConfigInterface {
  /**
   * The width of the renderer's canvas.
   */
  width?: number;

  /**
   * The height of the renderer's canvas.
   */
  height?: number;

  /**
   * The variable which defines either renderer will be adaptive or not.
   */
  adaptive?: boolean;

  /**
   * The frame rate of the renderer.
   */
  framesPerSecond?: number;

  /**
   * The background color of the renderer.
   */
  backgroundColor?: string;

  /**
   * The attributes of the renderer.
   */
  attributes?: Record<PropertyKey, string | number>;
}

/**
 * An interface representing the engine used to render the canvas element.
 *
 * @export
 * @interface RendererEngineInterface
 */
export interface RendererEngineInterface {
  /**
   * The canvas of the renderer.
   */
  canvas: HTMLCanvasElement;

  /**
   * The context of the renderer's cavnas.
   */
  context: CanvasRenderingContext2D;
}

/**
 * An interface representing the instance of a Renderer.
 *
 * @export
 * @interface RendererInterface
 */
export interface RendererInterface {
  /**
   * The width of the renderer's canvas.
   */
  width: number;

  /**
   * The height of the renderer's canvas.
   */
  height: number;

  /**
   * Adds an event listener to the specified element using the given event name and callback function.
   *
   * @param name The name of the event to listen for.
   * @param callback The function to call when the event is triggered.
   * @param element The element to attach the event listener to.
   */
  handleEvent(
    name: keyof HTMLElementEventMap,
    callback: (engine: RendererEngineInterface, event: PointerEvent & Event) => any,
    element: any,
  ): void;

  /**
   * Renders the scene on the canvas element using the given callback function.
   *
   * @param callback The function to call when rendering the scene.
   */
  render(callback: (engine: RendererEngineInterface) => any): void;
}
