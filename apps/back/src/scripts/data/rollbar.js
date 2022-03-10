const failure = {
  event_type: "new_item",
  data: {
    url: "https://rollbar.com/garydmcdowell/ps-front/items/54/",
    item: {
      public_item_id: null,
      integrations_data: {},
      level_lock: 0,
      last_activated_timestamp: 1645515099,
      assigned_user_id: null,
      group_status: 1,
      hash: "cbda70fc37963c9ea19744ef7a90edafbae79684",
      id: 1204739229,
      environment: "production",
      title_lock: 0,
      title: "Error: [object Object]",
      last_occurrence_id: 214403652023.0,
      last_occurrence_timestamp: 1645515099,
      platform: 1,
      first_occurrence_timestamp: 1645515099,
      project_id: 526559,
      resolved_in_version: null,
      status: 1,
      unique_occurrences: 1,
      group_item_id: null,
      last_occurrence: {
        body: {
          telemetry: [
            {
              body: {
                subtype: "DOMContentLoaded",
              },
              source: "client",
              level: "info",
              type: "navigation",
              timestamp_ms: 1645515098487.0,
            },
            {
              body: {
                subtype: "load",
              },
              source: "client",
              level: "info",
              type: "navigation",
              timestamp_ms: 1645515098503.0,
            },
            {
              body: {
                end_time_ms: 1645515098512.0,
                url: "/_next/static/css/9a6c3a94f390bff3.css",
                status_code: 200,
                start_time_ms: 1645515098511.0,
                response_content_type: "text/css; charset=UTF-8",
                subtype: "fetch",
                method: "GET",
              },
              source: "client",
              level: "info",
              type: "network",
              timestamp_ms: 1645515098511.0,
            },
            {
              body: {
                to: "/",
                from: "/login",
              },
              source: "client",
              level: "info",
              type: "navigation",
              timestamp_ms: 1645515098579.0,
            },
            {
              body: {
                end_time_ms: 1645515098709.0,
                url: "https://widget.gleap.io/widget/TFPQ6BrCt9aGmQLsMqSr33iVM32xBajd/config",
                status_code: 200,
                start_time_ms: 1645515098633.0,
                response_content_type: "application/json; charset=utf-8",
                request_content_type: "application/json;charset=UTF-8",
                subtype: "xhr",
                method: "GET",
              },
              source: "client",
              level: "info",
              type: "network",
              timestamp_ms: 1645515098709.0,
            },
            {
              body: {
                message: "[object Object]",
                stack:
                  "@https://console.premiersupremos.online/_next/static/chunks/19-8814cf8b9ab5cd12.js:1:52296\npromiseReactionJob@[native code]",
              },
              uuid: "99fb4990-5362-477b-dce4-d83a440d4c12",
              level: "error",
              timestamp_ms: 1645515098838.0,
              source: "client",
              type: "error",
            },
          ],
          trace: {
            frames: [
              {
                filename: "[native code]",
                method: "promiseReactionJob",
                lineno: null,
              },
              {
                filename:
                  "webpack://_N_E/../node_modules/react-social-login/dist/social-login.js",
                code: "    });",
                method: "[anonymous]",
                colno: 6,
                lineno: 4069,
              },
            ],
            exception: {
              message: "[object Object]",
              class: "Error",
              description: "[object Object]",
            },
          },
          orig_trace: {
            frames: [
              {
                lineno: null,
                method: "promiseReactionJob",
                filename: "[native code]",
              },
              {
                lineno: 1,
                method: "[anonymous]",
                colno: 52296,
                filename:
                  "https://console.premiersupremos.online/_next/static/chunks/19-8814cf8b9ab5cd12.js",
              },
            ],
            exception: {
              message: "[object Object]",
              class: "Error",
              description: "[object Object]",
            },
          },
        },
        endpoint: "api.rollbar.com/api/1/item/",
        uuid: "99fb4990-5362-477b-dce4-d83a440d4c12",
        language: "javascript",
        level: "error",
        timestamp: 1645515099,
        request: {
          url: "https://console.premiersupremos.online/",
          query_string: "",
          user_ip: "95.150.141.139",
        },
        server: {},
        environment: "production",
        framework: "browser-js",
        client: {
          timestamp: 1645515099,
          javascript: {
            language: "en-GB",
            screen: {
              width: 375,
              height: 812,
            },
            guess_uncaught_frames: true,
            plugins: [],
            source_map_enabled: true,
            code_version: "1",
            cookie_enabled: true,
            browser:
              "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Mobile/15E148 Safari/604.1",
          },
          runtime_ms: 343,
        },
        platform: "browser",
        context: "",
        notifier: {
          configured_options: {
            rollbarJsUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.24.0/rollbar.min.js",
            async: true,
            captureUncaught: true,
            captureUnhandledRejections: true,
            payload: {
              environment: "production",
              client: {
                javascript: {
                  source_map_enabled: true,
                  guess_uncaught_frames: true,
                  code_version: "1",
                },
              },
            },
          },
          version: "2.24.0",
          name: "rollbar-browser-js",
          diagnostic: {
            original_arg_types: ["string", "error", "undefined"],
            is_uncaught: true,
            raw_error: {
              message: "[object Object]",
              name: "Error",
              constructor_name: "Error",
              stack:
                "@https://console.premiersupremos.online/_next/static/chunks/19-8814cf8b9ab5cd12.js:1:52296\npromiseReactionJob@[native code]",
            },
          },
        },
        metadata: {
          access_token: "f7e6e1fd0e0c4466a2b10cc5f5d50e1f",
          debug: {
            routes: {
              start_time: 1645136170784.0,
              counters: {
                post_item: 12773595,
              },
            },
          },
          api_server_hostname: "k8s",
          timestamp_ms: 1645515099247.0,
        },
      },
      framework: 7,
      total_occurrences: 1,
      level: 40,
      counter: 54,
      last_modified_by: 272205,
      first_occurrence_id: 214403652023.0,
      activating_occurrence_id: 214403652023.0,
      last_resolved_timestamp: null,
    },
  },
};

module.exports = {
  failure,
};
