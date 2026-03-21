# React Context API + useAuth Hook (Complete Notes)

## 1. Problem (Props Drilling)
App → Navbar → Profile → Avatar  
Passing props manually at every level ❌

Context API → Global data access ✅

---

## 2. createContext()

const AuthContext = createContext()

- Creates a global pipe (empty channel)
- Does NOT store data
- Used to share data

---

## 3. AuthProvider (Data Creator)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

- Stores actual global state
- Wraps the app
- Sends data using Provider

---

## 4. Provider (Important)

<AuthContext.Provider value={{ user, setUser, loading, setLoading }}>

- Connects state → context
- Sends data to all children

Provider = bridge between state and components

---

## 5. value

value={{ user, setUser, loading, setLoading }}

- Actual global data
- Passed as object (multiple values)
- Allows read + update

---

## 6. children

{children}

<AuthProvider>
  <App />
</AuthProvider>

- children = App
- Only children can access context
- Without children → nothing renders

---

## 7. Context Flow

createContext() → creates pipe  
AuthProvider → creates data  
Provider → sends data  
children → receive data  
useContext → access data  

---

## 8. Accessing Context

const { user } = useContext(AuthContext)

- Gets data from Provider

---

## 9. Custom Hook (useAuth)

export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading } = context
}

- Wrapper around useContext
- Simplifies usage
- Centralizes logic

---

## 10. handleLogin Flow

const handleLogin = async ({ email, password }) => {
  setLoading(true)

  const data = await login({ email, password })

  setUser(data.user)

  setLoading(false)
}

---

## 11. Complete Login Flow

User clicks login  
→ handleLogin()  
→ setLoading(true)  
→ API call  
→ setUser(user)  
→ AuthProvider updates  
→ Provider sends new value  
→ All components re-render  

---

## 12. Global Update Behavior

setUser() → updates state in Provider  
→ Provider re-renders  
→ Context value updates  
→ All components using context re-render  

---

## 13. Mental Model

Context = pipe  
AuthProvider = data source  
Provider = data sender  
useContext / useAuth = data receiver  
useState = actual data  

---

## 14. Important Points

- Context does NOT store data  
- Data is stored in useState inside Provider  

- Without Provider → useContext returns undefined  
- Without children → nothing renders  

---

## 15. Why useAuth Hook?

const { user, handleLogin } = useAuth()

- Cleaner code  
- Reusable logic  
- Centralized auth handling  

---

## 16. Best Practice

return {
  user,
  loading,
  handleLogin
}

---

## Final Summary

Context API shares global state without props drilling.  
Provider stores state using useState and passes it via value.  
Custom hooks (useAuth) simplify access and logic.