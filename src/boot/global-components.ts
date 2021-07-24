import { boot } from 'quasar/wrappers';
import BlockDisplay from 'src/components/Blocks/BlockDisplay.vue';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.component('BlockDisplay', BlockDisplay);
});
