import { Config } from '@/models/Config';
import { StateProcessor } from '@/StateProcessor';
const config = Config.createFromInput({
  initialValues: [50],
  max: 100,
  min: 0,
  step: 1,
});

const processor = StateProcessor.init({
  config,
});

console.log(processor.updateValue(0, 20));
