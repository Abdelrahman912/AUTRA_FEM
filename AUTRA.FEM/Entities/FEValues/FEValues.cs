using AUTRA.FEM.Entities.Interpolation;
using AUTRA.FEM.Entities.NumericalIntegration;
using System;
using System.Collections.Generic;

namespace AUTRA.FEM.Entities.FEValues
{
    public class FEValues
    {
        #region private fields

        private Lazy<List<GPFEValues>> _cellValues;

        #endregion

        #region Properties
        public QuadratureRule QuadratureRule { get; }
        public Lagrange Interpolation { get;  }

        public List<GPFEValues> Values => _cellValues.Value;
        #endregion

        #region Constructors

        public FEValues(QuadratureRule quadratureRule, Lagrange interpolation)
        {
            QuadratureRule = quadratureRule;
            Interpolation = interpolation;
            _cellValues = new Lazy<List<GPFEValues>>(CalculateCellValues);
        }

        #endregion

        #region Methods

        private List<GPFEValues> CalculateCellValues()
        {
            var cellValues = new List<GPFEValues>();
            foreach (var gaussPoint in QuadratureRule.GaussPoints)
            {
                var shapeValues = Interpolation.ShapeValues(gaussPoint);
                var shapeDerivatives = Interpolation.ShapeDerivatives(gaussPoint);
                cellValues.Add(new GPFEValues(gaussPoint, shapeValues, shapeDerivatives));
            }
            return cellValues;
        }



        #endregion
    }
}
