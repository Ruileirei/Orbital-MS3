import { StyleSheet } from "react-native";
const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    width: '80%',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
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