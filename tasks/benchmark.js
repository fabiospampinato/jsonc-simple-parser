
/* IMPORT */

const fs = require ( 'fs' ),
      path = require ( 'path' ),
      benchmark = require ( 'benchloop' ),
      JSON5 = require ( 'json5' ),
      VSCJSONC = require ( 'jsonc-parser' ),
      {default: JSONC} = require ( '../dist' ),
      sampleInvalidPath = path.resolve ( __dirname, 'sample_invalid.json' ),
      sampleInvalid = fs.readFileSync ( sampleInvalidPath, 'utf8' ),
      sampleWithCommentsPath = path.resolve ( __dirname, 'sample_with_comments.json' ),
      sampleWithComments = fs.readFileSync ( sampleWithCommentsPath, 'utf8' ),
      sampleWithErrorsPath = path.resolve ( __dirname, 'sample_with_errors.json' ),
      sampleWithErrors = fs.readFileSync ( sampleWithErrorsPath, 'utf8' ),
      sampleWithoutCommentsPath = path.resolve ( __dirname, 'sample_without_comments.json' ),
      sampleWithoutComments = fs.readFileSync ( sampleWithoutCommentsPath, 'utf8' );

/* BENCHMARK */

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 7,
  log: 'compact'
});

benchmark.group ( 'Parse', () => {

  benchmark.group ( 'Invalid', () => {

    benchmark ({
      name: 'JSONC.parse',
      fn: () => {
        try {
          JSONC.parse ( sampleInvalid );
        } catch {}
      }
    });

    benchmark ({
      name: 'JSONC.parse (VSC)',
      fn: () => {
        try {
          VSCJSONC.parse ( sampleInvalid );
        } catch {}
      }
    });

    benchmark ({
      name: 'JSON5.parse',
      fn: () => {
        try {
          JSON5.parse ( sampleInvalid );
        } catch {}
      }
    });

  });

  benchmark.group ( 'With Comments', () => {

    benchmark ({
      name: 'JSONC.parse',
      fn: () => {
        JSONC.parse ( sampleWithComments );
      }
    });

    benchmark ({
      name: 'JSONC.parse (VSC)',
      fn: () => {
        VSCJSONC.parse ( sampleWithComments );
      }
    });

    benchmark ({
      name: 'JSON5.parse',
      fn: () => {
        JSON5.parse ( sampleWithComments );
      }
    });

  });

  benchmark.group ( 'Without Comments', () => {

    benchmark ({
      name: 'JSONC.parse',
      fn: () => {
        JSONC.parse ( sampleWithoutComments );
      }
    });

    benchmark ({
      name: 'JSONC.parse (VSC)',
      fn: () => {
        VSCJSONC.parse ( sampleWithoutComments );
      }
    });

    benchmark ({
      name: 'JSON5.parse',
      fn: () => {
        JSON5.parse ( sampleWithoutComments );
      }
    });

    benchmark ({
      name: 'JSON.parse',
      fn: () => {
        JSON.parse ( sampleWithoutComments );
      }
    });

  });

});

benchmark.group ( 'Lookup', () => {

  benchmark.group ( 'Start', () => {

    benchmark ({
      name: 'JSONC.lookup',
      fn: () => {
        JSONC.lookup ( sampleWithoutComments, 150 );
      }
    });

    benchmark ({
      name: 'JSONC.lookup (VSC)',
      fn: () => {
        VSCJSONC.getLocation ( sampleWithoutComments, 150 )
      }
    });

  });

  benchmark.group ( 'Middle', () => {

    benchmark ({
      name: 'JSONC.lookup',
      fn: () => {
        JSONC.lookup ( sampleWithoutComments, 41111 );
      }
    });

    benchmark ({
      name: 'JSONC.lookup (VSC)',
      fn: () => {
        VSCJSONC.getLocation ( sampleWithoutComments, 41111 )
      }
    });

  });

  benchmark.group ( 'End', () => {

    benchmark ({
      name: 'JSONC.lookup',
      fn: () => {
        JSONC.lookup ( sampleWithoutComments, 92900 );
      }
    });

    benchmark ({
      name: 'JSONC.lookup (VSC)',
      fn: () => {
        VSCJSONC.getLocation ( sampleWithoutComments, 92900 )
      }
    });

  });

});

benchmark.group ( 'Validate', () => {

  benchmark ({
    name: 'JSON',
    fn: () => {
      JSONC.validate ( sampleWithoutComments );
    }
  });

  benchmark ({
    name: 'JSONC',
    fn: () => {
      JSONC.validate ( sampleWithComments );
    }
  });

  benchmark ({
    name: 'Errors',
    fn: () => {
      JSONC.validate ( sampleWithErrors );
    }
  });

});
