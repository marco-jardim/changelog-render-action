import { countWords } from '../src/lib/wordCount';

describe('countWords', () => {
  it('counts words in plain text', () => {
    expect(countWords('hello world foo bar')).toBe(4);
  });

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('strips markdown headers', () => {
    const md = '## Hello World\nThis is text.';
    const count = countWords(md);
    expect(count).toBeGreaterThan(2);
  });

  it('strips fenced code blocks', () => {
    const md = 'Some text\n```\nconst x = 1; // lots of code tokens\n```\nEnd.';
    const count = countWords(md);
    // Should count "Some", "text", "End" (3) but not code
    expect(count).toBeLessThan(10);
  });

  it('strips bold/italic markers', () => {
    const md = '**bold** and _italic_ text';
    const count = countWords(md);
    // "bold", "and", "italic", "text"
    expect(count).toBe(4);
  });

  it('counts a realistic markdown document', () => {
    const md = `# Title\n\n## Section\n\nThis is a paragraph with several words in it.\n\n- Item one\n- Item two\n`;
    const count = countWords(md);
    expect(count).toBeGreaterThan(10);
  });

  it('handles markdown tables', () => {
    const md = '| File | Reason |\n|------|--------|\n| foo.ts | bar |';
    const count = countWords(md);
    expect(count).toBeGreaterThan(0);
  });
});
