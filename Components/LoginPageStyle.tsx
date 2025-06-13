import { StyleSheet } from "react-native";
const LoginStyles = StyleSheet.create({
  
  background: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    paddingVertical: 20,
    alignItems: 'center',
  },

  container1: {
    flex: 2.5,
    backgroundColor: '	#ffb933',
    justifyContent: 'center',
    alignItems: 'center',
  },

  shutter: {
    flex: 2,
    fontSize: 24,
    backgroundColor: '	#ffb933',
    justifyContent: 'center',
  },
  foodfindrLogo: {
    flex: 1,
    width: 200,
    height: 300,
    marginBottom: 15,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },

  container2: {
    flex: 3,
    justifyContent: 'flex-start',
    backgroundColor: 'transparent'
  },
  loginBox: {
    flex: 1.5,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    width: '80%',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    
  },
  
  input: {
    height: '30%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row-reverse',
    backgroundColor: '#ffb933',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: 'transparent',
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
  loginButtonWrapper: {
  alignSelf: 'flex-end',
  marginTop: 16,
  marginRight: 40, // adjust as needed
  },
  loginbutton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  topContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: '10%',
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  tagline: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
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