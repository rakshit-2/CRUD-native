import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, TextInput,ScrollView,Pressable, Alert,Image } from 'react-native';
import { getDatabase, ref, set, onValue, update, remove} from "firebase/database";
import { firebase } from './firebaseDB';
import { Axios } from 'axios';
import logo from './assets/favicon.png'

const App =()=> {
  const[name,setName]=useState("");
  const[phone,setPhone]=useState(0);
  const[age,setAge]=useState(0);
  const[delPhone,setDelPhone]=useState(0);
  const[loading,setLoading]=useState(true);
  const[textChange,setTextChange]=useState("View All")
  const[data,setData]=useState([
    {
      id:0,
      name:"check",
      age:12,
      phone:8652636733
    }
  ])
  const db = getDatabase();


  function submitClicked()
  {
    set(ref(db, 'users/' + phone), {
      name: name,
      age: age,
    });
    Alert.alert(`User Added Successfully!!!`)
    viewClicked()
  }


  function viewEachClicked()
  {
    const ele3 = ref(db, 'users/');
    var li=[];
    var ans;
    onValue(ele3, (snapshot) => {
      const data3=snapshot.val();
      li=Object.keys(data3)
      ans=data3;
    });
    var flag=0;
    for(var i=0;i<li.length;i++)
    {
      if(li[i]==delPhone)
      {
        Alert.alert(`Name: ${ans[li[i]].name} \nPhone: ${delPhone} Age: ${ans[li[i]].age}`)
        flag=1;
        break;
      }
    }
    if(flag==0)
    {
      Alert.alert("User doesnot exist!!")
    }
  }



  function viewClicked()
  {
    setLoading(true)
    const ele = ref(db, 'users/');
    var li=[];
    var ans;
    onValue(ele, (snapshot) => {
      const data=snapshot.val();
      li=Object.keys(data)
      ans=data;
    });
    var lis=[];
    for(var i=0;i<li.length;i++)
    {
      lis.push(
        {
          id:i,
          name:ans[li[i]].name,
          phone:li[i],
          age:ans[li[i]].age
        }
      )
    }
    setData(lis);
    setLoading(false)
    setTextChange("Refresh")
  }
  


  function updateClicked()
  {
    const ele1 = ref(db, 'users/');
    var li=[];
    var ans;
    onValue(ele1, (snapshot) => {
      const data1=snapshot.val();
      li=Object.keys(data1)
      ans=data1;
    });
    var flag=0;
    for(var i=0;i<li.length;i++)
    {
      if(li[i]==phone)
      {
        update(ref(db, 'users/' + phone), {
          name: name,
          age: age,
        });
        flag=1;
        Alert.alert("User updated successfully!!")
        viewClicked();
        break;
      }
    }
    if(flag==0)
    {
      Alert.alert("User doesnot exist!!")
    }
  }


  function deleteClicked()
  {
    const ele2 = ref(db, 'users/');
    var li=[];
    var ans;
    onValue(ele2, (snapshot) => {
      const data2=snapshot.val();
      li=Object.keys(data2)
      ans=data2;
    });
    var flag=0;
    for(var i=0;i<li.length;i++)
    {
      if(li[i]==delPhone)
      {
        remove(ref(db, 'users/' + delPhone), {
        });
        flag=1;
        Alert.alert("User deleted successfully!!")
        viewClicked();
        break;
      }
    }
    if(flag==0)
    {
      Alert.alert("User doesnot exist!!")
    }
    
  }





  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.head__text}>
          CRUD Bitches!!
        </Text>
      </View>
      <View style={styles.body}>
        <ScrollView>
          
          <TextInput onChangeText={(e)=>{setName(e)}} style={styles.inputText} placeholder="Name"/>
          <TextInput onChangeText={(e)=>{setPhone(e)}} keyboardType='number-pad' maxLength={10} style={styles.inputText} placeholder="Phone"/>
          <TextInput onChangeText={(e)=>{setAge(e)}} keyboardType='number-pad' maxLength={3} style={styles.inputText} placeholder="Age"/>
          <View style={styles.body__inner}>
            <Pressable style={[{backgroundColor:"#2ecc71"},styles.buttonCss]} onPress={()=>{submitClicked()}} >
              <Text style={styles.text}>Submit</Text>
            </Pressable>
            <Pressable style={[{backgroundColor:"#f1c40f"},styles.buttonCss]} onPress={()=>{updateClicked()}}>
              <Text style={styles.text}>Update</Text>
            </Pressable>
          </View>
          <TextInput onChangeText={(e)=>{setDelPhone(e)}} keyboardType='number-pad' maxLength={10} style={styles.inputText} placeholder="Phone of user to DELETE"/>
          <View style={styles.body__inner}>
            <Pressable style={[{backgroundColor:"#c0392b"},styles.buttonCss]} onPress={()=>{deleteClicked()}}>
              <Text style={styles.text}>Delete</Text>
            </Pressable>
            <Pressable style={[{backgroundColor:"#1B9CFC"},styles.buttonCss]} onPress={()=>{viewEachClicked()}}>
              <Text style={styles.text}>View Each</Text>
            </Pressable>
          </View>
          {/* <View style={styles.body__inner}>
            <Pressable style={[{backgroundColor:"#2C3A47"},styles.buttonCss]} onPress={()=>{viewClicked()}}>
              <Text style={styles.text}>{textChange}</Text>
            </Pressable>
          </View> */}
          <View style={[{flexDirection:"column",flexWrap:"wrap"},styles.body__inner]}>
            {
              loading?(
                <>
                <Image
                  style={styles.tinyLogo}
                  source={logo}
                />
                </>
              ):(
                data.map((ele)=>{
                  return(
                    <>
                    <Pressable key={ele.phone} style={[{backgroundColor:"#2C3A47"},styles.cardCss]}>
                      <Text style={styles.text}>Name: {ele.name}</Text>
                      <Text style={styles.text}>Age: {ele.age}</Text>
                      <Text style={styles.text}>Phone: {ele.phone}</Text>
                    </Pressable>
                    </>
                  )
                }) 
              )
                 
            }
            
          </View>
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    width:"100%",
    backgroundColor: 'white',
    flexDirection:"column",
  },
  head:{
    flex:1,
    backgroundColor:"white",
    justifyContent:"center",
    alignItems:"center",
  },
  head__text:{
    fontSize:25,
    fontWeight:"bold"
  },
  body:{
    width:"100%",
    flex:4,
    marginHorizontal:5,
    // border:"black",
    // borderWidth:1,
  },
  body__inner:{
    width:"100%",
    flex:1,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-around"
  },
  inputText:{

    borderColor:"grey",
    borderWidth:1,
    paddingHorizontal:10,
    paddingVertical:10,
    margin:10,
    borderRadius:10,
  },
  buttonCss:{
    width:"40%",
    color:"white",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    margin:10,
  },
  cardCss:{
    width:"90%",
    color:"white",
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    margin:10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});



export default App;
