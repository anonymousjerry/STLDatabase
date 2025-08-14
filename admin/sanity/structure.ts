import type { StructureResolver, StructureBuilder } from "sanity/structure"
// import UserTable from "../components/userTable"
import { UserTable } from "../components/userTable"
import { ModelTable } from "../components/modelTable"
import "../global.css"

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Admin Panel')
    .items([
      S.listItem()
        .title('Users Table')
        .child(S.component(UserTable).title('Users')),
      S.listItem()
        .title('Models Table')
        .child(S.component(ModelTable).title('Models')),
      // ...S.documentTypeListItems()
    ])
