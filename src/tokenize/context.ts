
/* CONTEXT */

const Context = {

  /* VARIABLES */

  offset: 0,
  offsetMax: Infinity,

  /* API */

  init: ( limit: number = Infinity ): void => {

    Context.offset = 0;
    Context.offsetMax = limit;

  }

};

/* EXPORT */

export default Context;
