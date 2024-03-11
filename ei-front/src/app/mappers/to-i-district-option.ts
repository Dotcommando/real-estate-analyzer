import { IDistrictOption, IOptionSet } from '../types';


export function toIDistrictOption(opts: Array<string | IOptionSet>): IDistrictOption[] {
  return opts.flatMap((opt: string | IOptionSet) => typeof opt === 'string'
    ? [ { value: opt, name: opt } ]
    : opt.synonyms.map(synonym => ({ value: opt.value, name: synonym })),
  );
}
