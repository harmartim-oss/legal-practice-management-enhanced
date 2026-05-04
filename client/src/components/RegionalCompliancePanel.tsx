/**
 * Regional Compliance Panel Component
 * Manages Northeast Ontario court selection, procedures, and compliance validation
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Info, MapPin, Mail, Calendar } from 'lucide-react';
import {
  getNortheastCourts,
  getProceduresByType,
  generateComplianceChecklist,
  calculateComplianceScore,
  getPresumptiveMode,
  validatePageLimit,
  type RegionalCourt,
} from '@/lib/regionalCompliance';

interface RegionalCompliancePanelProps {
  matterId: string;
  selectedCourt?: string;
  procedureType: 'civil' | 'family' | 'criminal';
  onCourtSelect: (courtId: string) => void;
}

export default function RegionalCompliancePanel({
  matterId,
  selectedCourt,
  procedureType,
  onCourtSelect,
}: RegionalCompliancePanelProps) {
  const courts = getNortheastCourts();
  const [expandedCourt, setExpandedCourt] = useState<string | null>(selectedCourt || null);
  const [showComplianceDetails, setShowComplianceDetails] = useState(false);

  const selectedCourtData = useMemo(() => {
    return courts.find(c => c.id === selectedCourt);
  }, [selectedCourt, courts]);

  const procedures = useMemo(() => {
    return getProceduresByType(procedureType);
  }, [procedureType]);

  const complianceChecklist = useMemo(() => {
    if (!selectedCourtData) return [];
    return generateComplianceChecklist(selectedCourtData, procedureType);
  }, [selectedCourtData, procedureType]);

  const complianceScore = useMemo(() => {
    return calculateComplianceScore(complianceChecklist);
  }, [complianceChecklist]);

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full space-y-6">
      {/* Court Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Northeast Ontario Court Selection
          </CardTitle>
          <CardDescription>
            Select the court location for this matter to apply regional procedures and compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courts.map(court => (
              <button
                key={court.id}
                onClick={() => {
                  onCourtSelect(court.id);
                  setExpandedCourt(court.id);
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCourt === court.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="font-semibold text-sm">{court.name}</div>
                <div className="text-xs text-gray-600 mt-1">{court.location}</div>
                {selectedCourt === court.id && (
                  <div className="flex items-center gap-1 mt-2 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Court Details */}
      {selectedCourtData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{selectedCourtData.name}</CardTitle>
            <CardDescription>Court Information and Contact Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">Trial Coordinator</div>
                  <div className="text-sm text-gray-600">{selectedCourtData.trialCoordinatorEmail}</div>
                </div>
              </div>

              {selectedCourtData.calendlyLink && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Scheduling</div>
                    <a
                      href={selectedCourtData.calendlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Use Calendly →
                    </a>
                  </div>
                </div>
              )}

              {selectedCourtData.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Address</div>
                    <div className="text-sm text-gray-600">{selectedCourtData.address}</div>
                  </div>
                </div>
              )}

              {selectedCourtData.phone && (
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Phone</div>
                    <div className="text-sm text-gray-600">{selectedCourtData.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Status */}
      {selectedCourtData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Compliance Status</CardTitle>
                <CardDescription>Regional procedure compliance for {procedureType} proceedings</CardDescription>
              </div>
              <Badge className={`text-lg px-3 py-1 ${getScoreBadgeVariant(complianceScore)}`}>
                {complianceScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Compliance Score Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Compliance Score</span>
                <span className={`font-bold ${getScoreColor(complianceScore)}`}>{complianceScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    complianceScore >= 80
                      ? 'bg-green-500'
                      : complianceScore >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${complianceScore}%` }}
                />
              </div>
            </div>

            {/* Procedures Summary */}
            <div className="space-y-2">
              <div className="font-semibold text-sm">Applicable Procedures</div>
              <div className="space-y-2">
                {procedures.slice(0, 3).map(proc => (
                  <div key={proc.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{proc.description}</div>
                      {proc.pageLimit && (
                        <div className="text-xs text-gray-600">Page limit: {proc.pageLimit} pages</div>
                      )}
                      {proc.presumptiveMode && (
                        <div className="text-xs text-gray-600">Mode: {proc.presumptiveMode}</div>
                      )}
                    </div>
                  </div>
                ))}
                {procedures.length > 3 && (
                  <div className="text-xs text-gray-600 pl-6">
                    +{procedures.length - 3} more procedures
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="space-y-2">
              <button
                onClick={() => setShowComplianceDetails(!showComplianceDetails)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {showComplianceDetails ? '▼' : '▶'} View Compliance Checklist ({complianceChecklist.length} items)
              </button>

              {showComplianceDetails && (
                <div className="mt-3 space-y-2 max-h-96 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {complianceChecklist.map(item => (
                    <div key={item.id} className="flex items-start gap-2 text-sm">
                      <div className="mt-1">
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.item}</div>
                        <div className="text-xs text-gray-600">{item.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            {complianceScore < 100 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-semibold text-yellow-900">Compliance Recommendations</div>
                    <ul className="mt-2 space-y-1 text-yellow-800 text-xs list-disc list-inside">
                      <li>Complete all required compliance checklist items</li>
                      <li>Verify document page limits</li>
                      <li>Confirm presumptive mode of appearance</li>
                      <li>Contact trial coordinator if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {complianceScore === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold text-green-900">Fully Compliant</div>
                  <div className="text-green-800 text-xs mt-1">
                    This matter meets all Northeast Ontario regional compliance requirements.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Regional Procedures Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regional Procedures Reference</CardTitle>
          <CardDescription>
            Applicable procedures for {procedureType} proceedings in Northeast Ontario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {procedures.map(proc => (
              <div key={proc.id} className="border rounded-lg p-3 space-y-2">
                <div className="font-semibold text-sm">{proc.description}</div>
                <div className="text-xs text-gray-600 space-y-1">
                  {proc.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
                {(proc.pageLimit || proc.presumptiveMode) && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {proc.pageLimit && (
                      <Badge variant="secondary" className="text-xs">
                        {proc.pageLimit} page limit
                      </Badge>
                    )}
                    {proc.presumptiveMode && (
                      <Badge variant="outline" className="text-xs">
                        {proc.presumptiveMode}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
