import test from "ava"
import File from "../lib/file"

test("#extensions handles one extension", async (t) => {
  let file = new File({
    path: "/",
    relativePath: "index.html",
  })

  t.deepEqual(file.extensions, ["html"])
})

test("#extensions handles two extensions", async (t) => {
  let file = new File({
    path: "/",
    relativePath: "index.html.jsx",
  })

  t.deepEqual(file.extensions, ["html", "jsx"])
})

test("#extensions handles a path with a period in it", async (t) => {
  let file = new File({
    path: "/",
    relativePath: "test.com/index.html.jsx",
  })

  t.deepEqual(file.extensions, ["html", "jsx"])
})

test("#_extension handles one extension", async (t) => {
  let file = new File({
    path: "/",
    relativePath: "index.html",
  })

  t.is(file._extension, ".html")
})

test("#_extension handles two extensions", async (t) => {
  let file = new File({
    path: "/",
    relativePath: "index.html.jsx",
  })

  t.is(file._extension, ".html.jsx")
})

test("#_extension handles a path with a period in it", async (t) => {
  let file = new File({
    path: "/",
    relativePath: "test.com/index.html.jsx",
  })

  t.is(file._extension, ".html.jsx")
})
