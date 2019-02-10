export default async (modulePath, props) => {
  let transform = await import(modulePath)
  let json = transform.default(props)

  return JSON.stringify(json, null, 2)
}
