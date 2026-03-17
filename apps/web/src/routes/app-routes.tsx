import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/app-shell'
import { DailyQueuePage } from '@/routes/daily-queue-page'
import { DeckDetailPage } from '@/routes/deck-detail-page'
import { HomePage } from '@/routes/home-page'
import { MockInterviewPage } from '@/routes/mock-interview-page'
import { PremiumPage } from '@/routes/premium-page'
import { ReviewPage } from '@/routes/review-page'
import { StudyPage } from '@/routes/study-page'

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<DailyQueuePage />} path="/daily-queue" />
        <Route element={<DeckDetailPage />} path="/decks/:deckId" />
        <Route element={<MockInterviewPage />} path="/mock-interview" />
        <Route element={<PremiumPage />} path="/premium" />
        <Route element={<ReviewPage />} path="/decks/:deckId/review" />
        <Route element={<StudyPage />} path="/study/:deckId" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppShell>
  )
}
