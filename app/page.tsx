"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, BookOpen, Trophy, BarChart3, AlertCircle } from "lucide-react"
import { questions } from "@/lib/questions"

export default function QuizPlatform() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleAnswerSelect = (option: string) => {
    if (showFeedback) return

    const question = questions[currentQuestion]
    const currentAnswers = selectedAnswers[currentQuestion] || []

    if (question.multipleAnswers) {
      if (currentAnswers.includes(option)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion]: currentAnswers.filter((a) => a !== option),
        })
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion]: [...currentAnswers, option],
        })
      }
    } else {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion]: [option],
      })
    }
  }

  const isAnswerSelected = (option: string) => {
    return (selectedAnswers[currentQuestion] || []).includes(option)
  }

  const isAnswerCorrect = (questionIndex: number) => {
    const question = questions[questionIndex]
    const selected = selectedAnswers[questionIndex] || []
    const correct = question.correctAnswer.split(",").map((a) => a.trim())

    if (selected.length !== correct.length) return false
    return correct.every((ans) => selected.includes(ans))
  }

  const isOptionCorrect = (optionId: string) => {
    const question = questions[currentQuestion]
    const correct = question.correctAnswer.split(",").map((a) => a.trim())
    return correct.includes(optionId)
  }

  const getOptionFeedbackColor = (optionId: string) => {
    if (!showFeedback) return ""

    const selected = isAnswerSelected(optionId)
    const correct = isOptionCorrect(optionId)

    if (selected && correct) return "border-green-500 bg-green-500/10"
    if (selected && !correct) return "border-red-500 bg-red-500/10"
    if (!selected && correct) return "border-green-500 bg-green-500/5"
    return "border-border opacity-60"
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((_, index) => {
      if (isAnswerCorrect(index)) correct++
    })
    return correct
  }

  const handleSubmit = () => {
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowFeedback(false)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowFeedback(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setShowFeedback(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const score = calculateScore()
  const percentage = Math.round((score / questions.length) * 100)

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">SAP Practice Platform</h1>
                <p className="text-sm text-muted-foreground">C_TS410_2022 Certification</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    SAP S/4HANA Business Process Integration
                  </h2>
                  <p className="text-lg text-muted-foreground">Practice Exam - C_TS410_2022</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                  <Card className="p-6 border-2">
                    <div className="text-3xl font-bold text-primary mb-2">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Total Questions</div>
                  </Card>
                  <Card className="p-6 border-2">
                    <div className="text-3xl font-bold text-primary mb-2">~90</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </Card>
                  <Card className="p-6 border-2">
                    <div className="text-3xl font-bold text-primary mb-2">Mixed</div>
                    <div className="text-sm text-muted-foreground">Question Types</div>
                  </Card>
                </div>

                <div className="space-y-4 text-left bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground">Exam Instructions:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        This practice exam contains {questions.length} questions from the official SAP C_TS410_2022
                        certification
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Some questions have multiple correct answers - read carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>After submitting each answer, you'll see correct answers and feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>You can navigate between questions at any time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Review your final score and detailed breakdown at the end</span>
                    </li>
                  </ul>
                </div>

                <Button size="lg" className="w-full md:w-auto px-12" onClick={() => setQuizStarted(true)}>
                  Start Practice Exam
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Exam Results</h1>
                <p className="text-sm text-muted-foreground">C_TS410_2022 Practice Exam</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <div
                  className={`inline-flex h-24 w-24 rounded-full items-center justify-center ${percentage >= 70 ? "bg-green-500/10" : "bg-destructive/10"}`}
                >
                  <Trophy className={`h-12 w-12 ${percentage >= 70 ? "text-green-500" : "text-destructive"}`} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-bold text-foreground">{percentage}%</h2>
                  <p className="text-lg text-muted-foreground">
                    {percentage >= 70 ? "Congratulations! You passed!" : "Keep practicing!"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                  <Card className="p-6 border-2">
                    <div className="text-3xl font-bold text-green-500 mb-2">{score}</div>
                    <div className="text-sm text-muted-foreground">Correct Answers</div>
                  </Card>
                  <Card className="p-6 border-2">
                    <div className="text-3xl font-bold text-destructive mb-2">{questions.length - score}</div>
                    <div className="text-sm text-muted-foreground">Incorrect Answers</div>
                  </Card>
                  <Card className="p-6 border-2">
                    <div className="text-3xl font-bold text-primary mb-2">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Total Questions</div>
                  </Card>
                </div>

                <Button size="lg" onClick={resetQuiz} className="w-full md:w-auto px-12">
                  Retake Exam
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Question Review</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {questions.map((question, index) => {
                  const correct = isAnswerCorrect(index)
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {correct ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        )}
                        <div className="text-left">
                          <span className="text-sm font-medium text-foreground">Question {index + 1}</span>
                          <p className="text-xs text-muted-foreground line-clamp-1">{question.question}</p>
                        </div>
                      </div>
                      <Badge variant={correct ? "default" : "destructive"} className="flex-shrink-0">
                        {correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">SAP Practice Exam</h1>
                <p className="text-xs text-muted-foreground">C_TS410_2022</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">Question {question.id}</Badge>
                  {question.multipleAnswers && (
                    <Badge variant="secondary" className="text-xs">
                      Multiple Answers Required
                    </Badge>
                  )}
                  {showFeedback && (
                    <Badge variant={isAnswerCorrect(currentQuestion) ? "default" : "destructive"} className="text-xs">
                      {isAnswerCorrect(currentQuestion) ? "Correct!" : "Incorrect"}
                    </Badge>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-medium text-foreground leading-relaxed">{question.question}</h2>
                {question.note && <p className="text-sm text-muted-foreground italic">{question.note}</p>}
              </div>

              <div className="space-y-3">
                {question.options.map((option) => {
                  const selected = isAnswerSelected(option.id)
                  const correct = isOptionCorrect(option.id)
                  const feedbackColor = getOptionFeedbackColor(option.id)

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showFeedback
                          ? feedbackColor
                          : selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                      } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            showFeedback
                              ? correct
                                ? "border-green-500 bg-green-500"
                                : selected
                                  ? "border-red-500 bg-red-500"
                                  : "border-muted-foreground"
                              : selected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                          }`}
                        >
                          {showFeedback ? (
                            correct ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : selected ? (
                              <XCircle className="h-4 w-4 text-white" />
                            ) : null
                          ) : (
                            selected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm text-foreground">{option.id})</span>
                          <span className="ml-2 text-foreground">{option.text}</span>
                          {showFeedback && correct && (
                            <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-500">
                              Correct Answer
                            </Badge>
                          )}
                          {showFeedback && selected && !correct && (
                            <Badge variant="outline" className="ml-2 text-xs border-red-500 text-red-500">
                              Your Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {showFeedback && (
                <Card className="p-4 bg-muted/50 border-2">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {isAnswerCorrect(currentQuestion) ? "Well done!" : "Learn from this:"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isAnswerCorrect(currentQuestion)
                          ? "You selected the correct answer. Keep up the great work!"
                          : `The correct answer${question.multipleAnswers ? "s are" : " is"}: ${question.correctAnswer}`}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          <div className="flex items-center justify-between mt-6 gap-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              {!showFeedback ? (
                selectedAnswers[currentQuestion]?.length > 0 ? (
                  <span className="text-primary font-medium">Answer selected</span>
                ) : (
                  <span>Select an answer to continue</span>
                )
              ) : (
                <span className="text-primary font-medium">Review and continue</span>
              )}
            </div>

            {!showFeedback ? (
              <Button onClick={handleSubmit} disabled={!selectedAnswers[currentQuestion]?.length}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestion === questions.length - 1 ? "View Results" : "Next Question"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
