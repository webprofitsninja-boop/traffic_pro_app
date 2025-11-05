import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Trash2 } from 'lucide-react';

interface PaymentMethodCardProps {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  onRemove: () => void;
  onSetDefault: () => void;
}

export function PaymentMethodCard({ 
  brand, last4, expMonth, expYear, isDefault, onRemove, onSetDefault 
}: PaymentMethodCardProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-purple-400" />
          <div>
            <p className="text-white font-semibold">
              {brand.toUpperCase()} •••• {last4}
            </p>
            <p className="text-sm text-gray-400">
              Expires {expMonth}/{expYear}
            </p>
          </div>
          {isDefault && <Badge variant="secondary">Default</Badge>}
        </div>
        <div className="flex gap-2">
          {!isDefault && (
            <Button variant="outline" size="sm" onClick={onSetDefault}>
              Set Default
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
