import { Icon, Menu } from 'semantic-ui-react'

export default (props: any) => {
  return (
    <Menu stackable>
      <Menu.Item>Million Dollar Contract</Menu.Item>
      <Menu.Item href="https://github.com/PaulsBecks/MillionDollarContract/blob/master/README.md">
        <Icon name="github" />
        Github
      </Menu.Item>
    </Menu>
  )
}
