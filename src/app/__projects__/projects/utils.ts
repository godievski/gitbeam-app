export const validateSlugName = (text: string) => {
  const match_regex = /^[a-z0-9.\-_]+$/.test(text)  
  const valid =
    !text.startsWith("-") &&
    !text.endsWith(".git") &&
    !text.endsWith(".atom") &&
    match_regex;
  return valid;
}