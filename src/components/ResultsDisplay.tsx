'use client';

import { type ExercisePlan } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type ResultsDisplayProps = {
  plan: ExercisePlan;
};

export function ResultsDisplay({ plan }: ResultsDisplayProps) {
  return (
    <div className="space-y-8 my-12">
      <Card className="bg-accent/50 border-accent shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-accent-foreground">
            Possible Reason for Your Pain
          </CardTitle>
          <CardDescription>
            Based on the information you provided, here is a possible
            explanation for your discomfort. This is not a medical diagnosis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-accent-foreground">{plan.reasonForPain}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Exercises</CardTitle>
          <CardDescription>
            These exercises may help alleviate your symptoms. Start slowly and
            stop if you feel sharp pain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {plan.recommendedExercises.map((exercise, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left">
                  <div className="flex-1 flex justify-between items-center pr-4">
                    <span className="font-medium text-lg">{exercise.name}</span>
                    <div className="flex gap-2 shrink-0">
                       <Badge variant="secondary">{exercise.sets} sets</Badge>
                       <Badge variant="secondary">{exercise.reps} reps</Badge>
                       {exercise.duration && <Badge variant="secondary">{exercise.duration}</Badge>}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {exercise.instructions}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Weekly Plan</CardTitle>
          <CardDescription>
            A sample schedule to incorporate these exercises into your week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Day</TableHead>
                <TableHead>Exercises</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.weeklyPlan.map((dayPlan, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{dayPlan.day}</TableCell>
                  <TableCell>{dayPlan.exercises.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
