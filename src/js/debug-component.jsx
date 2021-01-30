export default ({ children, ...props }) => {
  return <div style={{ border: '1px solid', margin: 5, padding: 5 }}>
    <p>Test section</p>
    <pre>
      {JSON.stringify(props, null, 2)}
    </pre>
    {children}
  </div>
}