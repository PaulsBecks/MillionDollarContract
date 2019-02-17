import React from 'react'
import factory from '../ethereum/factory'
import _ from 'lodash'
import {
  Button,
  Form,
  Header,
  Modal,
  Tab,
  Loader,
  Icon,
} from 'semantic-ui-react'
import { SketchPicker } from 'react-color'
import Menu from '../components/menu'

const getWeb3 = require('../ethereum/web3').default

interface RootStateInterface {
  pixels: any
  modalOpen: boolean
  rows: number[]
  xClickPos: number
  yClickPos: number
  selectedPixel: any
  newPixel: {
    color: string
    hoverText: string
  }
  transactionPending: boolean
}

interface RootPropsInterface {
  pixels: any
}

/* Root component of MillionDollarContract Webpage
 *
 */
class Root extends React.Component<RootPropsInterface, RootStateInterface> {
  static async getInitialProps() {
    const pixels = await factory()
      .methods.getPixelList()
      .call()
    const colors = await factory()
      .methods.getColorsFromList(pixels)
      .call()
    return {
      pixels: pixels.reduce(
        (obj: any, pixel: any, i: number) => ({
          ...obj,
          [pixel]: {
            background: parseInt(colors[i]),
          },
        }),
        {}
      ),
    }
  }

  constructor(props: any) {
    super(props)
    this.state = {
      pixels: null,
      modalOpen: false,
      rows: [],
      xClickPos: 0,
      yClickPos: 0,
      selectedPixel: null,
      newPixel: {
        color: '#dddddd',
        hoverText: '',
      },
      transactionPending: false,
    }
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    for (let j = 0; j < 1000; j += 10) {
      let imgData = ctx.createImageData(1000, 10)

      for (let i = 0; i < imgData.data.length; i += 4) {
        let number = this.props.pixels[j * 10e4 + i / 4]
          ? this.props.pixels[(j * 10e4 + i) / 4].background
          : 0xffffff
        let range = 256
        imgData.data[i + 0] = number >> 16
        imgData.data[i + 1] = (number >> 8) % range
        imgData.data[i + 2] = number % range
        imgData.data[i + 3] = 255
      }
      ctx.putImageData(imgData, 0, j)
    }
  }

  getCursorPosition = event => {
    const canvas = this.refs.canvas
    const rect = canvas.getBoundingClientRect()
    const xClickPos = Math.round(event.clientX - rect.left) - 1
    const yClickPos = Math.round(event.clientY - rect.top) - 1
    const pixelKey = yClickPos * 1000 + xClickPos
    const selectedPixel = this.props.pixels[pixelKey]
    this.setState({ xClickPos, yClickPos, modalOpen: true, selectedPixel })
  }

  handleHoverTextChange = (event: any) => {
    this.setState({
      newPixel: {
        ...this.state.newPixel,
        hoverText: event.currentTarget.value,
      },
    })
  }

  handleColorChange = (color: any) => {
    this.setState({ newPixel: { ...this.state.newPixel, color: color.hex } })
  }
  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  handlePixelClick = (selectedPixel: any) => {
    this.setState(selectedPixel)
  }

  renderPanes = () => {
    return [
      {
        menuItem: 'Color',
        render: () => (
          <Tab.Pane>
            <Form>
              <Form.Field>
                <label>Hex Color Code</label>
                <SketchPicker
                  color={this.state.newPixel.color}
                  onChangeComplete={this.handleColorChange}
                />
              </Form.Field>
            </Form>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Image',
        render: () => <Tab.Pane>Not implemented yet.</Tab.Pane>,
      },
    ]
  }

  submitPixel = async () => {
    const web3 = getWeb3(window)
    const accounts = await web3.eth.getAccounts()

    const setPixel = factory(window).methods.setPixel(
      this.state.yClickPos * 1000 + this.state.xClickPos,
      parseInt(this.state.newPixel.color.slice(-6), 16),
      this.state.newPixel.hoverText
    )
    this.setState({ transactionPending: true, modalOpen: false })
    setPixel
      .send({
        from: accounts[0],
        value: web3.utils.toWei('0.01'),
      })
      .then(pixel => {
        this.setState({ transactionPending: false })
      })
      .catch(err => {
        //toast to notify
        this.setState({ transactionPending: false, modalOpen: true })
      })
  }

  render() {
    return (
      <div>
        <Menu />
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <canvas
          style={{ border: '1px solid black' }}
          ref="canvas"
          width={1000}
          height={1000}
          onClick={this.getCursorPosition}
        />
        <Modal open={this.state.modalOpen} onClose={this.closeModal}>
          <Modal.Header>
            Pixel at {this.state.xClickPos}|{this.state.yClickPos}
          </Modal.Header>
          <Modal.Content>
            {this.state.selectedPixel ? (
              <Modal.Description>
                <p>
                  color:{' '}
                  {'#' +
                    (
                      '00000' +
                      parseInt(this.state.selectedPixel.background).toString(16)
                    ).slice(-6)}
                </p>
              </Modal.Description>
            ) : (
              <Modal.Description>
                <Header>This pixel is free.</Header>
                <Form>
                  <Form.Field>
                    <label>Hover Text</label>
                    <input
                      placeholder="This is an awesome pixel!"
                      onChange={this.handleHoverTextChange}
                      value={this.state.newPixel.hoverText}
                    />
                  </Form.Field>
                </Form>
                <br />
                <Tab panes={this.renderPanes()} />
              </Modal.Description>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button primary icon onClick={this.submitPixel}>
              Buy <Icon name="right chevron" />
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.transactionPending} size="small" basic>
          <Modal.Content>
            <Loader>
              Thanks for you submission. Your request gets processed. This may
              take up to 30 sec.
            </Loader>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default Root
