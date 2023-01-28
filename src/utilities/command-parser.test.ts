import { config } from '~/config';
import { parseCommand } from '~/utilities';

describe('parseCommand', () => {
  test('it should return command null and content when message is not valid command', () => {
    const message = 'hello world';
    const { command, content } = parseCommand(message);
    expect(command).toBe(null);
    expect(content).toBe('hello world');
  });

  test('it should return command null when first word is only the prefix without command', () => {
    const message = `${config.prefix} hello world`;
    const { command, content } = parseCommand(message);
    expect(command).toBe(null);
    expect(content).toBe('! hello world');
  });

  test('it should return command without prefix and content when message empty when not contain', () => {
    const message = `${config.prefix}do`;
    const { command, content } = parseCommand(message);
    expect(command).toBe('do');
    expect(content).toBe('');
  });

  test('it should return command without prefix and content', () => {
    const message = `${config.prefix}do hello world`;
    const { command, content } = parseCommand(message);
    expect(command).toBe('do');
    expect(content).toBe('hello world');
  });
});
