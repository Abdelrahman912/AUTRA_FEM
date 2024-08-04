using AUTRA.FEM.Entities.Elements;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Complex;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AUTRA.FEM.Entities.Solver
{
    public class Assembler
    {
        #region Private Fields
        private readonly DofHandler _dofHandler;
        #endregion

        #region Properties

        #endregion

        #region Constructors
        public Assembler(DofHandler dofHandler)
        {
            _dofHandler = dofHandler;
        }
        #endregion

        #region Methods


        private void AssembleElementStiffnes(Matrix<double> K,Matrix<double> ke  , List<int> dofs)
        {
            for (int i = 0; i < dofs.Count; i++)
            {
                for(int j = 0; j < dofs.Count; j++)
                {
                    var ig = dofs[i];
                    var jg = dofs[j];
                    if (ig != -1 && jg != -1)
                    {
                        K[ig, jg] += ke[i, j];
                    }
                }
            }
        }

        private void AssembleNodalForce(Vector<double> F, Vector<double> fe, List<int> dofs)
        {
            for (int i = 0; i < dofs.Count; i++)
            {
                var ig = dofs[i];
                if (ig != -1)
                {
                    F[ig] += fe[i];
                }
            }
        }

        public ( Matrix<double> K,  Vector<double> F) Assemble()
        {
            var nDofs = _dofHandler.NoDofs;
            var K = Matrix<double>.Build.Dense(nDofs, nDofs);
            var F = Vector<double>.Build.Dense(nDofs);
            _dofHandler.ElementsId.ForEach(eid =>
            {
                var dofs = _dofHandler.GetElementDofs(eid);
                var ke = _dofHandler.GetElementStiffnessMatrix(eid);
                AssembleElementStiffnes(K, ke, dofs);
            });
            _dofHandler.NodesId.ForEach(nid =>
            {
                var dofs = _dofHandler.GetNodeDofs(nid);
                var fe = _dofHandler.GetNodalForce(nid);
                AssembleNodalForce(F, fe, dofs);
            });
            return (K, F);
        }
        #endregion
    }
}
