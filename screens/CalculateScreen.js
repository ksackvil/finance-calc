import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import { Form, Item, Input, Label, Container, Text, Button, Picker, Icon } from 'native-base';

export default class CalcForm extends Component {
  static navigationOptions = {
    title: 'Calculate',
  };

  constructor(props) {
    super(props) 

    this.state = {
      selected: undefined
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <Container>
        <Form>
          <Item fixedLabel>
            <Label>Mass</Label>
            <Input placeholder="enter mass"/>
          </Item>
          <Item fixedLabel last>
          <Label>Acceleration</Label>
            <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                placeholder="Select Acceleration"
                placeholderIconColor="#007aff"
                style={{ width: undefined }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item label="- 9.8 (Earth)" value="key0" />
                <Picker.Item label="- 3.8 (Mars)" value="key1" />
              </Picker>
          </Item>
        </Form>
        <View style={{margin:20, alignSelf:"center"}}>
          <Button onPress={() => navigate('Settings', { name: 'Jane' })}>
            <Text>Calculate</Text>
          </Button>
        </View>
        <View style={{margin: 12, alignSelf: "center"}}>
          <Text style={{fontWeight:"bold", fontSize: 18, marginTop:10}}>
            Calculating Force (Newtons)
          </Text>
          <Text style={{textAlign:"center", fontSize:30, margin: 10}}>
            F = m x a
          </Text>
          <Text style= {{marginLeft: 20, marginRight:20, marginTop: 5, marginBottom: 5}}>
            {`\u2022 Force (F) is mesured in newtons (N), it's sign represents force direction`}
          </Text>
          <Text style= {{marginLeft: 20, marginRight:20, marginTop: 5, marginBottom: 5}}>
            {`\u2022 Mass (m) is mesured in kilograms (Kg)`}
          </Text>
          <Text style= {{marginLeft: 20, marginRight:20, marginTop: 5, marginBottom: 5}}>
            {`\u2022 Acceleration due to gravity (a) is mesured in meters per second squared (m/s^2)`}
          </Text>
        </View>
        <View style={{margin: 10, }}>
          <Text>
          This equation is one of the most useful in classical physics. It is a concise statement of Isaac Newton's Second Law of Motion, holding both the proportions and vectors of the Second Law.
          </Text>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create