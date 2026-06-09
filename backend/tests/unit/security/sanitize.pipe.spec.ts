import { SanitizeInputPipe } from '../../../src/apps/api/security/sanitize.pipe';

describe('SanitizeInputPipe', () => {
  const pipe = new SanitizeInputPipe();

  it('escapes HTML and trims strings', () => {
    const payload = {
      name: '  <script>alert(1)</script>  ',
      nested: {
        value: "O'Reilly & Associates",
      },
    };

    const sanitized = pipe.transform(payload) as Record<string, string>;

    expect(sanitized.name).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect((sanitized.nested as Record<string, string>).value).toBe(
      "O'Reilly &amp; Associates",
    );
  });
});
