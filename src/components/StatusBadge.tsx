import { InspectionStatus, SurveyorStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<InspectionStatus, string> = {
  'Pending Review': 'bg-warning/15 text-warning border-warning/20',
  'Quote Sent': 'bg-secondary/15 text-secondary border-secondary/20',
  'Quote Approved': 'bg-accent/15 text-accent border-accent/20',
  'Surveyor Assigned': 'bg-primary/15 text-primary border-primary/20',
  'Inspection Completed': 'bg-success/15 text-success border-success/20',
};

const surveyorStyles: Record<SurveyorStatus, string> = {
  'Active': 'bg-success/15 text-success border-success/20',
  'Busy': 'bg-warning/15 text-warning border-warning/20',
  'On Leave': 'bg-muted text-muted-foreground border-border',
  'Unavailable': 'bg-destructive/15 text-destructive border-destructive/20',
};

export const InspectionStatusBadge = ({ status }: { status: InspectionStatus }) => (
  <Badge variant="outline" className={cn('text-[11px] font-medium', statusStyles[status])}>
    {status}
  </Badge>
);

export const SurveyorStatusBadge = ({ status }: { status: SurveyorStatus }) => (
  <Badge variant="outline" className={cn('text-[11px] font-medium', surveyorStyles[status])}>
    {status}
  </Badge>
);
