import scrapeJob from "./scrapeJob"
import adPosition from "./adPosition"
import blogPost from "./blogPost"
import user from "./user"
// Remove custom 'code' type to avoid conflict with Sanity built-in 'code'
export const schemaTypes = [scrapeJob, adPosition, blogPost, user]
