/* IMPORT */

import { parse } from "reghex";
import grammar from "../tokenize/grammar";
import tokens from "./tokens";

/* MAIN */

const parser = parse(grammar(tokens)) as (input: string) => string;

/* EXPORT */

export default parser;
