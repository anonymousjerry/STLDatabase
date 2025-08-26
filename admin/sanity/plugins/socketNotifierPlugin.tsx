"use client";
import React from "react";
import { definePlugin } from "sanity";
import SocketNotifier from "../../components/SocketNotifier";

export const socketNotifierPlugin = definePlugin({
  name: "socket-notifier",
  studio: {
    components: {
      layout: (props) => (
        <>
          <SocketNotifier />
          {props.renderDefault(props)}
        </>
      ),
    },
  },
});
