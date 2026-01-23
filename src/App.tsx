import { Button } from './components/ui/button'


function App() {

  return (
    <div className="w-full mx-auto">
      <h1 className="text-2xl font-bold text-blue-500">Storybook coming soon</h1>
      <Button variant="default" size="xs">default xs</Button>
      <Button variant="default" size="sm">default sm</Button>
      <Button variant="default">default</Button>
      <Button variant="default" size="lg">default lg</Button>
      <Button variant="outline">outline</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="link">link</Button>
      <Button variant="destructive">destructive</Button>
    </div>
  )
}

export default App
