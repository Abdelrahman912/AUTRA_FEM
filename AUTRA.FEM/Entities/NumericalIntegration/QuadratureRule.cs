using System;
using System.Collections.Generic;
using System.Text;

namespace AUTRA.FEM.Entities.NumericalIntegration
{
    public abstract class QuadratureRule
    {
        #region Properties
        public List<GaussPoint> GaussPoints { get; }
        #endregion

        #region Constructors
        protected QuadratureRule(NoQuadraturePoints nqp)
        {
            GaussPoints = CalculateGaussPoints(nqp);
        }
        #endregion

        #region Methods

        private List<GaussPoint> CalculateGaussPoints(NoQuadraturePoints nqp)
        {
            List<GaussPoint> gps;
            switch (nqp)
            {
                case NoQuadraturePoints.TWO:
                     gps = new List<GaussPoint>
                    {
                        new GaussPoint(-1.0 / Math.Sqrt(3.0), -1.0 / Math.Sqrt(3.0), 1.0, 1.0),
                        new GaussPoint(1.0 / Math.Sqrt(3.0), -1.0 / Math.Sqrt(3.0), 1.0, 1.0),
                        new GaussPoint(1.0 / Math.Sqrt(3.0), 1.0 / Math.Sqrt(3.0), 1.0, 1.0),
                        new GaussPoint(-1.0 / Math.Sqrt(3.0), 1.0 / Math.Sqrt(3.0), 1.0, 1.0)
                    };
                    break;
                default:
                    gps = new List<GaussPoint>();
                    break;
            }
            return gps;

        }

        #endregion

    }
}
