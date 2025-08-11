import type { StructureResolver, StructureBuilder } from "sanity/structure"
// import UserTable from "../components/userTable"
import { UserTable } from "../components/userTable"

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Admin Panel')
    .items([
      S.listItem()
        .title('Users Table')
        .child(S.component(UserTable).title('Users')),
      ...S.documentTypeListItems()
    ])
