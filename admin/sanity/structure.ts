import type { StructureResolver, StructureBuilder } from "sanity/structure"
// import UserTable from "../components/userTable"
import { UserTable } from "../components/userTable"
import { ModelTable } from "../components/modelTable"
import { CategoryTable } from "../components/categoryTable"
import { AdPositionTable } from "../components/adPositionTable"
import ScrapeJobTable from "../components/scrapeJobTable"
import SocketNotifier from "../components/SocketNotifier"
import NotificationCenter from "../components/NotificationCenter"
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
      S.listItem()
        .title('Categories Table')
        .child(S.component(CategoryTable).title('Categories')),
      S.listItem()
        .title('Ad Position Management')
        .child(S.component(AdPositionTable).title('Ad Positions')),
      S.listItem()
        .title('Scraping Job Management')
        .child(S.component(ScrapeJobTable).title('Scraping Jobs')),
      S.listItem()
        .title("Notification Center")
        .child(S.component(NotificationCenter).title("Notification Center")),
    ])
