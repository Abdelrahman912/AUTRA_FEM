using AUTRA.FEM.Entities.BoundaryConditions;
using AUTRA.FEM.Entities.Elements;
using iText.Layout.Element;
using System.Collections.Generic;
using System.Linq;

namespace AUTRA.Dtos
{
    public  static class DtosExtension
    {

        private static Constraint ToModel(this ConstraintDto constraintDto)
        {
            var free = constraintDto.Free;
            return new Constraint(free[0], free[1], free[2]);
        }

        public static Node ToModel(this NodeDto nodeDto)
        {
            var forceDto = nodeDto.Force;
            var force = new NodalForce(forceDto.X, forceDto.Y, forceDto.Z);
            var constraint = nodeDto.Constraint.ToModel();
            var node = new Node(nodeDto.Id, nodeDto.Position.X, nodeDto.Position.Z, nodeDto.Position.Y, constraint, force); // in three js y and z are swapped
            return node;
        }

       
        public static LineElement ToModel(this FrameElementDto dto, List<Node> nodes)
        {
            var startNode = nodes.First(n => n.Id == dto.StartNodeId);
            var endNode = nodes.First(n => n.Id == dto.EndNodeId);  
            var ele = new LineElement(dto.ElementId, startNode, endNode, dto.E, dto.A);
            return ele;
        }

    }
}
