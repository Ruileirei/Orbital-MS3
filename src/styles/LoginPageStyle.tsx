import { StyleSheet } from "react-native";
const LoginStyles = StyleSheet.create({
  
  background: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'flex-start',
    paddingTop: -10,
    paddingHorizontal: 0,
  },

  foodfindrLogo: {
    width: 200,
    height: 120,
    marginBottom: 20,
    alignSelf: 'center',
  },

  loginBox: {
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 24,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 20,
    
  },
  
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#ffb933',
    paddingVertical: 12,
    borderRadius: 20,
    paddingHorizontal: 20,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
  },
  
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },

  registerText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
  },

  link: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#007bff',
  },

  bottomRegister: {
  position: "absolute",
  bottom: 20,
  width: "100%",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},
});

export default LoginStyles;