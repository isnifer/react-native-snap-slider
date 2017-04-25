import React, { Component, PropTypes } from 'react'
import { View, Text, Slider, StyleSheet } from 'react-native'

class SnapSlider extends Component {
  static propTypes = {
    onSlidingComplete: PropTypes.func,
    style: View.propTypes.style,
    containerStyle: View.propTypes.style,
    itemWrapperStyle: View.propTypes.style,
    itemStyle: Text.propTypes.style,
    items: PropTypes.array,
    defaultItem: PropTypes.number,
  }

  static defaultProps = {
    minimumValue: 0,
    maximumValue: 1,
  }

  state = {
    sliderRatio: this.props.maximumValue / (this.props.items.length - 1),
    value: sliderRatio * this.props.defaultItem,
    item: this.props.defaultItem,
    adjustSign: 1,
    itemWidth: [],
    sliderWidth: 0,
    sliderLeft: 0,
  }

  _sliderStyle = () => ([
    defaultStyles.slider,
    { width: this.state.sliderWidth, left: this.state.sliderLeft },
    this.props.style,
  ])

  _onSlidingCompleteCallback = (v) => {
    // pad the value to the snap position
    const halfRatio = this.state.sliderRatio / 2
    let item = 0
    for (;;) {
      if ((v < this.state.sliderRatio) || (v <= 0)) {
        if (v >= halfRatio) {
          item += 1
        }

        break
      }

      v -= this.state.sliderRatio
      item += 1
    }

    let value = this.state.sliderRatio * i
    value += this.state.adjustSign * 0.000001

    const adjustSign = this.state.adjustSign > 0 ? -1 : 1

    this.setState({ value, adjustSign, item: i })

    // callback
    this.props.onSlidingComplete()
  }

  /*
  componentWillUpdate() {
      //get the width for all items
      var iw = []
      for (var i = 0; i < this.props.items.length; i++) {
          var node = eval('this.refs.t' + i)
          node.measure(function (ox, oy, width, height, px, py) {
              iw.push(width)
          })
      }
  },
  */

  _getItemWidth = (x) => {
    const { width } = x.nativeEvent.layout
    this.setState({
      itemWidth: this.state.itemWidth.concat(width),
    })

    // we have all itemWidth determined, let's update the silder width
    if (this.state.itemWidth.length === this.props.items.length) {
      const max = Math.max.apply(null, this.state.itemWidth)
      if (this.refs.slider && this.state.sliderWidth > 0) {
        const buffer = 30 // add buffer for the slider 'ball' control
        // if (buffer > sliderWidth) { // strange comparison that false everytime
          // buffer = 0
        // }

        this.setState({
          sliderWidth: this.state.sliderWidth - max + buffer,
          sliderLeft: (max / 2) - (buffer / 2),
        })
      }
    }
  }

  _getSliderWidth = (e) => (
    this.setState({ sliderWidth: e.nativeEvent.layout.width })
  )

  render() {
    const itemStyle = [defaultStyles.item, this.props.itemStyle]
    return (
      <View
        onLayout={this._getSliderWidth}
        style={[defaultStyles.container, this.props.containerStyle]}>
        <Slider
          ref="slider"
          {...this.props}
          style={this._sliderStyle()}
          onSlidingComplete={this._onSlidingCompleteCallback}
          value={this.state.value}
        />
        <View style={[defaultStyles.itemWrapper, this.props.itemWrapperStyle]}>
          {this.props.items.map((i, j) => (
            <Text
              key={i.value}
              ref={`t${j}`}
              style={itemStyle}
              onLayout={this._getItemWidth}>
              {i.label}
            </Text>
          ))}
        </View>
      </View>
    )
  }
})

var defaultStyles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  itemWrapper: {
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
})

export default SnapSlider
