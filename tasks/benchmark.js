
/* IMPORT */

import benchmark from 'benchloop';
import JSON5 from 'json5';
import VSCJSONC from 'jsonc-parser';
import fs from 'node:fs';
import path from 'node:path';
import JSONC from '../dist/index.js';

const sampleInvalidPath = path.resolve ( process.cwd (), 'tasks', 'sample_invalid.json' );
const sampleInvalid = fs.readFileSync ( sampleInvalidPath, 'utf8' );
const sampleWithCommentsPath = path.resolve ( process.cwd (), 'tasks', 'sample_with_comments.json' );
const sampleWithComments = fs.readFileSync ( sampleWithCommentsPath, 'utf8' );
const sampleWithErrorsPath = path.resolve ( process.cwd (), 'tasks', 'sample_with_errors.json' );
const sampleWithErrors = fs.readFileSync ( sampleWithErrorsPath, 'utf8' );
const sampleWithoutCommentsPath = path.resolve ( process.cwd (), 'tasks', 'sample_without_comments.json' );
const sampleWithoutComments = fs.readFileSync ( sampleWithoutCommentsPath, 'utf8' );

/* MAIN */

benchmark.config ({
  iterations: 7
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
