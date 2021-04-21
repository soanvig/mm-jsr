import { Renderer } from '@/Renderer';

export const getRenderer = () => Renderer.init({
  container: document.body,
});