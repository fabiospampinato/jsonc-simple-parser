declare module 'reghex' {
  type ReghexParser = ((input: string) => unknown) & ((quasis: TemplateStringsArray | string[], ...expressions: unknown[]) => unknown);

  export function match(name: string, transform: unknown): ReghexParser;
  export function parse(matcher: unknown): ReghexParser;
}
