import ReactDOM from 'react-dom/client';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import ExplainSelection from '../components/ExplainSelection';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'select-click-explain',
      position: 'inline',
      anchor: 'body',

      onMount(container) {
        const root = ReactDOM.createRoot(container);

        root.render(<ExplainSelection />);

        return root;
      },

      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});