declare const Fixtures: {
  errors: {
    comment: string;
    empty: string;
    prefix: string;
    suffix: string;
  };
  ast: {
    input: string;
    output: unknown;
  };
  lookup: {
    object: string;
    array: string;
    objectPartial: string;
  };
  parse: {
    input: string;
    output: unknown;
  };
  strip: {
    input: string;
    output: string;
  };
};

export default Fixtures;
