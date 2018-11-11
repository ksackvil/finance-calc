import React, { Component } from 'react';
import { StyleSheet, View, Modal, TouchableHighlight} from 'react-native';
import { Form, Item, Input, Label, Container, Text, Button, Picker, Icon } from 'native-base';
import { ResultsModal } from '../components/ResultsModal';

export default class CalcForm extends Component {
  static navigationOptions = {
    title: 'Monthly Savings',
  };

  constructor(props) {
    super(props) 

    this.state = {
      selected: undefined,
      modalVisible: false,
      age: null,
      invalidAge: false,
      income: null,
      invalidIncome: false,
      invalidForm: false,
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleValueChange(key, value) {
    if (isNaN(value)){
      if(key==='age'){this.setState({age: value, invalidAge: true})}
      else if(key==='income'){this.setState({income: value, invalidIncome: true})}
    }
    else if(key==='age' && !(value % 1 === 0)) {
      if(key==='age'){this.setState({age: value, invalidAge: true})}
    }
    else {
      if(key==='age'){this.setState({age: value, invalidAge: false, invalidIncome: false})}
      else if(key==='income'){this.setState({income: value, invalidAge: false, invalidIncome: false})}
    }    
  }

  render() {    
    return (
      <Container>
        <View style={{marginTop: '30%', marginRight:10}}>
          <Form >
            <Item error={this.state.invalidAge} fixedLabel>
              <Label>Age</Label>
              <Input onChangeText={(val) => this.handleValueChange('age', val)} placeholder="Enter current age"/>
              {
                this.state.invalidAge ?
                (<Icon name='close-circle' />):
                (null)
              }
            </Item>
            <Item error={this.state.invalidIncome} fixedLabel>
              <Label>Income</Label>
              <Input onChangeText={(val) => this.handleValueChange('income', val)} placeholder="Enter annual income"/>
              {
                this.state.invalidIncome ?
                (<Icon name='close-circle' />):
                (null)
              }
            </Item>
            {/* <Item fixedLabel last>
            <Label>Savings Plan</Label>
              <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  placeholder="Select Acceleration"
                  placeholderIconColor="#007aff"
                  style={{ width: undefined }}
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label="RRSP" value="key0" />
                  <Picker.Item label="- 3.8 (Mars)" value="key1" />
                </Picker>
            </Item> */}
          </Form>
        </View>
        <View style={{margin:20, alignSelf:"center"}}>
          {
            (this.state.invalidAge || this.state.invalidIncome) || ((this.state.age===null || this.state.age==="") || (this.state.income===null || this.state.income==="" ))?
            (
              <Button disabled onPress={() => this.setModalVisible(true)}>
                <Text>Calculate</Text>
              </Button>
            ):
            (
              <Button onPress={() => this.setModalVisible(true)}>
                <Text>Calculate</Text>
              </Button>
            )
          }
        </View>
        {
          this.state.modalVisible ?
          (
            <ResultsModal 
              age={this.state.age}
              income={this.state.income}
              visible={true}
              setModalVisible={this.setModalVisible.bind(this)}
            />
          ):
          (null)
        }

        {/* <View style={{margin: 12, alignSelf: "center"}}>
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
        </View> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create