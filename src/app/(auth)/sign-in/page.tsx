'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema"
import z from "zod"
import axios from "axios"
import { toast } from "@/components/ui/toast"
import { ApiResponse } from "@/types/ApiResponse"

export default function Page() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  // debounce value is used bcz i dont want to make request to backend on each click
  const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 300)  // default,delay 

  const router = useRouter()
  // zod implimentation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (debouncedUsername) {
        setisCheckingUsername(true)
        setUsernameMessage("")

        try {
          const response = await axios.get(`/api/check-username-availability?username=${debouncedUsername}`)
          console.log(response)
          setUsernameMessage(response.data.message)
        } catch (error) {
          setUsernameMessage("Error while checking username availability")
          console.log("Error while checking username availability", error);
        } finally {
          setisCheckingUsername(false)
        }
      }
    }
    checkUsernameAvailability()
  }, [debouncedUsername])

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)

    try {
      const response = await axios.post("/api/sign-up", data)
      toast.add({
        title: "Success",
        description: response.data.message,
      })
      router.replace(`/verify/${username}`)

    } catch (error) {
      console.log("Error while signup", error)

      if (axios.isAxiosError<ApiResponse>(error)) {
        const errorMessage = error.response?.data.message
        toast.add({
          title: "Signup Failed",
          description: errorMessage || "Something went wrong.",
          type: "error",
        })
      } else {
        toast.add({
          title: "Signup Failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        })
      }
    } finally {
      setisSubmitting(false)
    }


  }
  
  return
}


