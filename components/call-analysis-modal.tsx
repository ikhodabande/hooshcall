"use client"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, X, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CallAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  callData?: {
    id: number
    customerName: string
    date: string
    time: string
    score: number
    role: string
    summary: string
    email: string
    phone: string
    address: string
  }
}

interface Message {
  id: number
  sender: "user" | "customer"
  content: string
  timestamp: string
  avatar: string
}

export function CallAnalysisModal({ isOpen, onClose, callData }: CallAnalysisModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const messages: Message[] = [
    {
      id: 1,
      sender: "user",
      content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
      timestamp: "11:56",
      avatar: "ک.ا",
    },
    {
      id: 2,
      sender: "user",
      content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است.",
      timestamp: "12:32",
      avatar: "ک.ا",
    },
    {
      id: 3,
      sender: "customer",
      content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
      timestamp: "13:12",
      avatar: "س.ر",
    },
    {
      id: 4,
      sender: "user",
      content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
      timestamp: "11:56",
      avatar: "ک.ا",
    },
  ]

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Reset to beginning if at the end
        if (currentTime >= duration) {
          setCurrentTime(0)
          audioRef.current.currentTime = 0
        }

        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.log("Audio playback error:", error)
      setIsPlaying(false)

      // Show user-friendly error message
      toast({
        title: "خطا در پخش صوت",
        description: "امکان پخش فایل صوتی وجود ندارد.",
        variant: "destructive",
      })
    }
  }

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)

    if (audioRef.current) {
      // Pause before seeking to prevent conflicts
      const wasPlaying = isPlaying
      if (wasPlaying) {
        audioRef.current.pause()
      }

      audioRef.current.currentTime = newTime

      // Resume playing if it was playing before
      if (wasPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handleDownload = () => {
    toast({
      title: "دانلود شروع شد",
      description: "فایل صوتی در حال دانلود است...",
      variant: "success",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Simulate audio progress - replace the existing useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1
          if (newTime >= duration) {
            setIsPlaying(false)
            return duration
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, duration])

  // Add this new useEffect after the existing ones
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setIsPlaying(false)
      console.log("Audio loading error - using simulated playback")
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  // Add this useEffect to handle modal cleanup
  useEffect(() => {
    if (!isOpen) {
      // Reset audio state when modal closes
      setIsPlaying(false)
      setCurrentTime(0)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isOpen])

  if (!callData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 gap-0">
        <div className="flex h-full">
          {/* Left Panel - Audio Analysis */}
          <div className="flex-1 p-6 bg-background">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">بررسی عمیق متن و صوت</DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Audio Waveform Visualization */}
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Waveform Display */}
                <div className="mb-4 h-20 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="flex items-end gap-1 h-full w-full px-4">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 bg-teal-500 rounded-t transition-all duration-200 ${
                          i < (currentTime / duration) * 100 ? "opacity-100" : "opacity-30"
                        }`}
                        style={{
                          height: `${Math.random() * 60 + 20}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button size="icon" onClick={togglePlayPause} className="bg-teal-500 hover:bg-teal-600">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleTimeChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground persian-numbers">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Volume and Download */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Slider value={volume} max={100} step={1} onValueChange={handleVolumeChange} className="w-24" />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      دانلود
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversation Transcript */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">متن گفتگو</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80 px-6 pb-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "customer" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback
                            className={`text-sm ${
                              message.sender === "customer" ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${message.sender === "customer" ? "text-right" : ""} max-w-[80%]`}>
                          <div
                            className={`p-3 rounded-lg text-sm ${
                              message.sender === "customer"
                                ? "bg-teal-50 text-teal-900 dark:bg-teal-900/20 dark:text-teal-100"
                                : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 persian-numbers">{message.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Call Summary */}
          <div className="w-96 bg-teal-500 text-white p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">خلاصه تماس ۲۴ - مرداد ۱۴:۴۵</h2>
              </div>

              {/* Compatibility Score */}
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold persian-numbers mb-1">{callData.score}</div>
                  <div className="text-sm opacity-90">امتیاز سازگاری</div>
                </CardContent>
              </Card>

              {/* Role */}
              <div className="text-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  نقش: {callData.role}
                </Badge>
              </div>

              {/* AI Summary */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">خلاصه هوش مصنوعی</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm leading-relaxed opacity-90">{callData.summary}</p>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="bg-white text-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-teal-600">اطلاعات مشتری</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">نام</span>
                    <span className="text-sm">{callData.customerName}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      ایمیل
                    </span>
                    <span className="text-sm text-blue-600">{callData.email}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      تلفن
                    </span>
                    <span className="text-sm persian-numbers">{callData.phone}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      آدرس
                    </span>
                    <span className="text-sm">{callData.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Phone className="w-4 h-4 ml-2" />
                  تماس مجدد
                </Button>
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Mail className="w-4 h-4 ml-2" />
                  ارسال ایمیل
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata">
          <source src="/sample-call.mp3" type="audio/mpeg" />
        </audio>
      </DialogContent>
    </Dialog>
  )
}
